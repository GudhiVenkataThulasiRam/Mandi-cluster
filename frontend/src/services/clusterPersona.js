/**
 * Cluster Personas & Market Intelligence Profiler
 * Translates K-Means mathematical clusters and market trading patterns
 * into distinct, meaningful business profiles for farmers.
 */

// Trained K-Means Cluster Characteristics:
// Cluster 1: High Modal Price (~₹6,188/qtl), lower/selective arrival
// Cluster 0: High Arrival (~23.1 tonnes/records), baseline commercial rates (~₹1,980/qtl)
const GLOBAL_CLUSTER_DEFINITIONS = {
  1: {
    personaName: 'Premium Price Hub',
    tag: 'Peak Modal Realization',
    description: 'Markets in Cluster 1 historically command significantly higher modal prices with selective trading lots.',
    recommendation: 'Target these mandis with premium, well-graded crops to capture peak price margins.',
  },
  0: {
    personaName: 'High-Volume Commercial Hub',
    tag: 'Heavy Arrival & High Liquidity',
    description: 'Markets in Cluster 0 handle large trading volumes with steady, reliable buyer absorption.',
    recommendation: 'Best suited for selling large harvest volumes rapidly with minimal risk of unsold produce.',
  },
}

/**
 * Computes semantic personas for each cluster dynamically.
 * Accurately handles cases whether one cluster or multiple clusters are returned.
 */
export function computeClusterPersonas(markets) {
  if (!markets || !markets.length) return GLOBAL_CLUSTER_DEFINITIONS

  const clusterData = {}
  markets.forEach((m) => {
    if (m.cluster != null) {
      if (!clusterData[m.cluster]) {
        clusterData[m.cluster] = []
      }
      clusterData[m.cluster].push(m)
    }
  })

  const clusterIds = Object.keys(clusterData)
  const personas = {}

  // Compute aggregates for each cluster present
  const stats = clusterIds.map((id) => {
    const list = clusterData[id]
    const validPrices = list.map((m) => m.avgPrice).filter((v) => v != null)
    const validArrivals = list.map((m) => m.avgArrival).filter((v) => v != null)

    const avgPrice = validPrices.length
      ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length
      : 0
    const avgArrival = validArrivals.length
      ? validArrivals.reduce((a, b) => a + b, 0) / validArrivals.length
      : 0

    return { id, avgPrice, avgArrival, count: list.length }
  })

  // When multiple clusters are returned in the query:
  if (stats.length > 1) {
    const sortedByPrice = [...stats].sort((a, b) => b.avgPrice - a.avgPrice)
    const highest = sortedByPrice[0]

    stats.forEach((s) => {
      if (s.id === highest.id) {
        personas[s.id] = {
          clusterId: s.id,
          name: `Cluster ${s.id}`,
          personaName: 'Premium High-Demand Hub',
          tag: 'Highest Price Realization',
          description: `Historically captures the highest modal prices (avg ₹${Math.round(s.avgPrice).toLocaleString('en-IN')}/qtl) across your query results.`,
          recommendation: 'Top choice for capturing maximum revenue realization on your produce.',
          avgPrice: s.avgPrice,
          avgArrival: s.avgArrival,
          marketCount: s.count,
        }
      } else {
        personas[s.id] = {
          clusterId: s.id,
          name: `Cluster ${s.id}`,
          personaName: 'High-Volume Commercial Hub',
          tag: 'High Liquidity & Steady Trading',
          description: `Handles large arrival volumes with reliable buyer participation at baseline market rates.`,
          recommendation: 'Best suited for clearing bulk harvest quantities with guaranteed buyer absorption.',
          avgPrice: s.avgPrice,
          avgArrival: s.avgArrival,
          marketCount: s.count,
        }
      }
    })
  } else {
    // When all returned markets belong to a single cluster, use the trained cluster definition
    stats.forEach((s) => {
      const idNum = Number(s.id)
      const def = GLOBAL_CLUSTER_DEFINITIONS[idNum]

      if (def) {
        personas[s.id] = {
          clusterId: s.id,
          name: `Cluster ${s.id}`,
          personaName: def.personaName,
          tag: def.tag,
          description: def.description,
          recommendation: def.recommendation,
          avgPrice: s.avgPrice,
          avgArrival: s.avgArrival,
          marketCount: s.count,
        }
      } else {
        // Fallback based on price level
        const isHigh = s.avgPrice >= 3500
        personas[s.id] = {
          clusterId: s.id,
          name: `Cluster ${s.id}`,
          personaName: isHigh ? 'Premium Market Hub' : 'Commercial Trading Mandi',
          tag: isHigh ? 'High Value Realization' : 'Active Commercial Liquidity',
          description: `Mandis in Cluster ${s.id} share consistent price and arrival behaviors.`,
          recommendation: 'Review individual mandi arrival volumes and prices below to pick your best mandi.',
          avgPrice: s.avgPrice,
          avgArrival: s.avgArrival,
          marketCount: s.count,
        }
      }
    })
  }

  return personas
}

export function getPersonaForCluster(clusterId, personas) {
  if (clusterId == null) {
    return {
      personaName: 'Market Mandi',
      tag: 'Segment',
      description: 'Historical market pattern group',
      recommendation: '',
    }
  }

  if (personas && personas[clusterId]) {
    return personas[clusterId]
  }

  const idNum = Number(clusterId)
  if (GLOBAL_CLUSTER_DEFINITIONS[idNum]) {
    return GLOBAL_CLUSTER_DEFINITIONS[idNum]
  }

  return {
    personaName: `Cluster ${clusterId}`,
    tag: 'Market Segment',
    description: 'Historical market pattern group',
    recommendation: '',
  }
}

/**
 * Assigns a unique market-level behavior badge so each mandi can be distinguished
 * even when several mandis belong to the same cluster.
 */
export function getMarketBehaviorBadge(market, allMarkets = []) {
  if (!market || !allMarkets.length) return null

  const prices = allMarkets.map((m) => m.avgPrice).filter((v) => v != null)
  const arrivals = allMarkets.map((m) => m.avgArrival).filter((v) => v != null)
  const stds = allMarkets.map((m) => m.stdPrice).filter((v) => v != null)

  const maxPrice = prices.length ? Math.max(...prices) : null
  const minPrice = prices.length ? Math.min(...prices) : null
  const maxArrival = arrivals.length ? Math.max(...arrivals) : null
  const avgStd = stds.length ? stds.reduce((a, b) => a + b, 0) / stds.length : 0

  if (market.avgPrice != null && market.avgPrice === maxPrice && allMarkets.length > 1) {
    return {
      label: 'Top Price',
      className: 'badge-top-price',
      tooltip: 'Offers the highest historical modal price in your query results',
    }
  }

  if (market.avgArrival != null && market.avgArrival === maxArrival && maxArrival > 0 && allMarkets.length > 1) {
    return {
      label: 'Highest Volume',
      className: 'badge-high-volume',
      tooltip: 'Largest historical produce arrival volume (highest trading liquidity)',
    }
  }

  if (market.stdPrice != null && market.stdPrice < avgStd * 0.7 && market.stdPrice > 0) {
    return {
      label: 'Most Stable',
      className: 'badge-stable',
      tooltip: 'Low price volatility — predictable historical returns',
    }
  }

  if (market.stdPrice != null && market.stdPrice > avgStd * 1.3 && avgStd > 0) {
    return {
      label: 'High Swing',
      className: 'badge-swing',
      tooltip: 'Higher price volatility — rates fluctuate day-to-day',
    }
  }

  if (market.avgPrice != null && market.avgPrice === minPrice && allMarkets.length > 2) {
    return {
      label: 'Value Mandi',
      className: 'badge-value',
      tooltip: 'Lower modal rates — check if transport savings justify selling here',
    }
  }

  return null
}
