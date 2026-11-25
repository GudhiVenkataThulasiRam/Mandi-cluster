import { useEffect, useState } from 'react'
import { getStates, getCommodities, getDistricts, getRecommendations } from '../services/api.js'
import SelectionPanel from '../components/SelectionPanel.jsx'
import SummaryCards from '../components/SummaryCards.jsx'
import MarketTable from '../components/MarketTable.jsx'
import PriceChart from '../components/PriceChart.jsx'
import ArrivalChart from '../components/ArrivalChart.jsx'
import ClusterAnalysis from '../components/ClusterAnalysis.jsx'
import MapSection from '../components/MapSection.jsx'
import Icon from '../components/Icon.jsx'
import MarketComparison from '../components/MarketComparison.jsx'

export default function Dashboard() {
  const [states, setStates] = useState([])
  const [commodities, setCommodities] = useState([])
  const [districts, setDistricts] = useState([])
  const [sel, setSel] = useState({ state: '', commodity: '', district: '' })
  const [loading, setLoading] = useState({
    states: true,
    commodities: false,
    districts: false,
    results: false,
  })
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const setL = (k, v) => setLoading((l) => ({ ...l, [k]: v }))

  useEffect(() => {
    getStates()
      .then(setStates)
      .catch((e) =>
        setError(
          `Could not load states. Check that the Flask server is running. (${e.message})`
        )
      )
      .finally(() => setL('states', false))
  }, [])

  useEffect(() => {
    setCommodities([])
    setDistricts([])
    if (!sel.state) return
    let live = true
    setL('commodities', true)
    getCommodities(sel.state)
      .then((d) => live && setCommodities(d))
      .catch((e) => live && setError(e.message))
      .finally(() => live && setL('commodities', false))
    return () => {
      live = false
    }
  }, [sel.state])

  useEffect(() => {
    setDistricts([])
    if (!sel.state || !sel.commodity) return
    let live = true
    setL('districts', true)
    getDistricts(sel.state, sel.commodity)
      .then((d) => live && setDistricts(d))
      .catch((e) => live && setError(e.message))
      .finally(() => live && setL('districts', false))
    return () => {
      live = false
    }
  }, [sel.state, sel.commodity])

  const onFind = async () => {
    setError('')
    setL('results', true)
    try {
      const data = await getRecommendations({ ...sel, topN: 10 })
      setResult({ ...data, query: { ...sel } })
    } catch (e) {
      setResult(null)
      setError(e.message)
    } finally {
      setL('results', false)
    }
  }

  return (
    <div className="container dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>Agricultural Market Intelligence</h1>
          <p>
            Filter by state, commodity, and district to discover top mandis ranked by historical modal prices and grouped by K-Means cluster patterns.
          </p>
        </div>
      </header>

      <SelectionPanel
        states={states}
        commodities={commodities}
        districts={districts}
        sel={sel}
        setSel={setSel}
        loading={loading}
        onFind={onFind}
        canFind={Boolean(sel.state && sel.commodity)}
      />

      {error && (
        <div className="alert" role="alert">
          <Icon name="alert" size={20} />
          <div>
            <strong>Service Notice: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading.results && (
        <div className="loader" role="status">
          <span className="spinner dark" aria-hidden="true" />
          <span>Running clustering model and computing price percentiles…</span>
        </div>
      )}

      {!result && !loading.results && !error && (
        <div className="empty-box">
          <Icon name="filter" size={28} />
          <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
            Select a State and Commodity to begin market analysis
          </p>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            Choose where your produce is harvested to view matching mandis.
          </span>
        </div>
      )}

      {result && result.markets.length === 0 && (
        <div className="empty-box">
          <Icon name="alert" size={28} />
          <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
            No records found for {result.query.commodity} in {result.query.state}
            {result.query.district ? `, ${result.query.district}` : ''}.
          </p>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            Try expanding your search to all districts or selecting a different commodity.
          </span>
        </div>
      )}

      {result && result.markets.length > 0 && (
        <div className="results">
          <div className="results-meta-banner">
            <div className="meta-info">
              <span className="meta-tag">
                <Icon name="pin" size={16} />
                {result.query.state}
              </span>
              <span>•</span>
              <span className="meta-tag">
                <Icon name="scale" size={16} />
                {result.query.commodity}
              </span>
              {result.query.district && (
                <>
                  <span>•</span>
                  <span className="meta-tag">{result.query.district}</span>
                </>
              )}
            </div>
            <span className="muted" style={{ fontSize: '0.85rem' }}>
              {result.message}
            </span>
          </div>

          <nav className="view-tabs" aria-label="Dashboard analytical views">
            <button
              type="button"
              className={`view-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <Icon name="chart" size={15} />
              <span>Complete Overview</span>
            </button>
            <button
              type="button"
              className={`view-tab ${activeTab === 'table' ? 'active' : ''}`}
              onClick={() => setActiveTab('table')}
            >
              <Icon name="store" size={15} />
              <span>Rankings & Compare</span>
            </button>
            <button
              type="button"
              className={`view-tab ${activeTab === 'charts' ? 'active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              <Icon name="truck" size={15} />
              <span>Price & Arrival Analytics</span>
            </button>
            <button
              type="button"
              className={`view-tab ${activeTab === 'clusters' ? 'active' : ''}`}
              onClick={() => setActiveTab('clusters')}
            >
              <Icon name="cluster" size={15} />
              <span>Cluster Segmentation</span>
            </button>
          </nav>

          {/* Metric KPI cards shown across views */}
          <SummaryCards markets={result.markets} />

          {/* Table & Comparison View */}
          {(activeTab === 'all' || activeTab === 'table') && (
            <>
              <MarketTable markets={result.markets} />
              <MarketComparison markets={result.markets} />
            </>
          )}

          {/* Price & Arrival Charts View */}
          {(activeTab === 'all' || activeTab === 'charts') && (
            <>
              <PriceChart markets={result.markets} />
              <ArrivalChart markets={result.markets} />
            </>
          )}

          {/* Cluster Segmentation View */}
          {(activeTab === 'all' || activeTab === 'clusters') && (
            <ClusterAnalysis markets={result.markets} />
          )}

          {/* Map Section */}
          {activeTab === 'all' && <MapSection />}
        </div>
      )}
    </div>
  )
}
