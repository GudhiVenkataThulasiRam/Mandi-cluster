import { useMemo, useState } from 'react'
import { fmt } from '../utils.js'
import { clusterColor } from '../chartTheme.js'
import { computeClusterPersonas, getPersonaForCluster, getMarketBehaviorBadge } from '../services/clusterPersona.js'
import Icon from './Icon.jsx'

export default function MarketComparison({ markets }) {
  const [selected, setSelected] = useState([])

  const personas = useMemo(() => computeClusterPersonas(markets), [markets])

  const toggleMarket = (marketIndex) => {
    setSelected((current) => {
      if (current.includes(marketIndex)) {
        return current.filter((item) => item !== marketIndex)
      }

      if (current.length >= 3) return current

      return [...current, marketIndex]
    })
  }

  const selectedMarkets = markets.filter((m, index) =>
    selected.includes(index)
  )

  const metrics = [
    ['Average price', 'avgPrice', true],
    ['Median price', 'medianPrice', true],
    ['Minimum price', 'minPrice', true],
    ['Maximum price', 'maxPrice', true],
    ['Average arrival', 'avgArrival', false],
    ['Cluster & Persona', 'cluster', false],
  ]

  const displayValue = (value, currency, key, market) => {
    if (value == null) return '—'
    if (key === 'cluster') {
      const persona = getPersonaForCluster(value, personas)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span className="pill" style={{ '--c': clusterColor(value), width: 'fit-content' }}>
            Cluster {value}
          </span>
          {persona?.personaName && (
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: clusterColor(value) }}>
              {persona.personaName}
            </span>
          )}
          {persona?.tag && (
            <span className="muted" style={{ fontSize: '0.74rem' }}>
              {persona.tag}
            </span>
          )}
        </div>
      )
    }
    if (currency) return `₹${fmt(value, 2)}`
    if (typeof value === 'number') return fmt(value, 2)
    return value
  }

  const downloadCSV = () => {
    const headers = [
      'Market',
      'District',
      'Average Price (Rs/quintal)',
      'Median Price (Rs/quintal)',
      'Minimum Price (Rs/quintal)',
      'Maximum Price (Rs/quintal)',
      'Average Arrival',
      'Cluster',
      'Cluster Persona',
    ]

    const rows = selectedMarkets.map((m) => {
      const persona = getPersonaForCluster(m.cluster, personas)
      return [
        m.market,
        m.district,
        m.avgPrice,
        m.medianPrice,
        m.minPrice,
        m.maxPrice,
        m.avgArrival,
        m.cluster,
        persona?.personaName || '',
      ]
    })

    const escapeCSV = (value) => {
      const text = value == null ? '' : String(value)
      return `"${text.replace(/"/g, '""')}"`
    }

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n')

    const blob = new Blob(
      ['\uFEFF' + csvContent],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'MandiCluster_Market_Comparison.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <section className="card" aria-label="Market side by side comparison">
      <div className="card-head">
        <div>
          <h2>Side-by-Side Market Comparison</h2>
          <p className="muted">
            Select up to 3 markets to benchmark historical prices, arrivals, and behavioral cluster personas.
          </p>
        </div>
        <div className="step-indicator">
          {selected.length}/3 Selected
        </div>
      </div>

      <div className="comparison-options">
        {markets.map((m, index) => {
          const isSelected = selected.includes(index)
          const isDisabled = !isSelected && selected.length >= 3
          const badge = getMarketBehaviorBadge(m, markets)

          return (
            <label
              key={index}
              className={`comparison-chip ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggleMarket(index)}
              />
              <span>{m.market}</span>
              <span className="muted" style={{ fontSize: '0.78rem' }}>({m.district})</span>
              {badge && (
                <span className={`mandi-trait-badge sm ${badge.className}`}>
                  {badge.label}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {selectedMarkets.length > 0 ? (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '220px' }}>Metric</th>
                  {selectedMarkets.map((m, index) => {
                    const badge = getMarketBehaviorBadge(m, markets)
                    return (
                      <th key={index} style={{ color: 'var(--primary-800)', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <strong>{m.market}</strong>
                          {badge && (
                            <span className={`mandi-trait-badge ${badge.className}`} title={badge.tooltip}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <div className="muted" style={{ fontSize: '0.75rem', fontWeight: 'normal', textTransform: 'none', marginTop: '0.2rem' }}>
                          {m.district} • Rank #{m.rank}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody>
                {metrics.map(([label, key, currency]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {label}
                    </td>
                    {selectedMarkets.map((m, index) => (
                      <td key={index} className="num">
                        {displayValue(m[key], currency, key, m)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="comparison-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={downloadCSV}
            >
              <Icon name="download" size={17} />
              <span>Download Comparison CSV</span>
            </button>
          </div>
        </>
      ) : (
        <div className="empty-box" style={{ padding: '2rem 1rem' }}>
          Select any 2 or 3 markets above to generate an instant side-by-side performance matrix.
        </div>
      )}
    </section>
  )
}
