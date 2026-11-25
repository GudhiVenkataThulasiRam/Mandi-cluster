// src/services/api.js
// Dedicated service module for communicating with the Flask backend

// In development, Vite proxies '/api' to http://127.0.0.1:5000 (configured in vite.config.js)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic helper to perform GET requests and handle errors cleanly
 */
async function getRequest(endpoint, params = {}) {
  // Convert params object to query string (e.g. ?state=Punjab&commodity=Wheat)
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Server error: ${response.status}`);
  }

  return await response.json();
}

/**
 * 1. Fetch available states from Flask
 */
export async function getStates() {
  const data = await getRequest('/api/states');
  return data.states || [];
}

/**
 * 2. Fetch commodities available in a selected state
 */
export async function getCommodities(state) {
  if (!state) return [];
  const data = await getRequest('/api/commodities', { state });
  return data.commodities || [];
}

/**
 * 3. Fetch districts available for a selected state and commodity
 */
export async function getDistricts(state, commodity) {
  if (!state || !commodity) return [];
  const data = await getRequest('/api/districts', { state, commodity });
  return data.districts || [];
}

/**
 * Helper to ensure market records have consistent field names
 */
function normalizeMarket(record, index) {
  return {
    rank: record.rank || index + 1,
    market: record.market || record.market_name || '—',
    district: record.district || '—',
    state: record.state || '—',
    commodity: record.commodity || '—',
    avgPrice: Number(record.avg_price ?? record.average_price ?? 0),
    medianPrice: Number(record.median_price ?? 0),
    minPrice: Number(record.min_price ?? 0),
    maxPrice: Number(record.max_price ?? 0),
    stdPrice: Number(record.std_price ?? 0),
    avgArrival: Number(record.avg_arrival ?? record.average_arrival ?? 0),
    totalArrival: Number(record.total_arrival ?? 0),
    cluster: record.cluster !== undefined ? Number(record.cluster) : null,
  };
}

/**
 * 4. Fetch market recommendations & clustering results from Flask
 */
export async function getRecommendations({ state, commodity, district, topN = 10 }) {
  const params = {
    state,
    commodity,
    top_n: topN,
  };
  
  if (district) {
    params.district = district;
  }

  const data = await getRequest('/api/recommendations', params);
  const rawMarkets = data.markets || [];

  return {
    message: data.message || '',
    markets: rawMarkets.map(normalizeMarket),
    clusterSummary: data.cluster_summary || [],
  };
}
