import Icon from './Icon.jsx'

// Placeholder only: the API returns no coordinates, so no locations are drawn or invented.
const hasKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

export default function MapSection() {
  return (
    <section className="card map-card" aria-label="Geographic map module">
      <div className="card-head">
        <div>
          <h2>Geographic Market Locations & Route Transit</h2>
          <p className="muted">
            Spatial distribution of mandis and distance analysis.
          </p>
        </div>
        <span className="step-indicator" style={{ background: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' }}>
          {hasKey ? 'API Key Configured' : 'Offline Mode'}
        </span>
      </div>

      <div className="map-empty">
        <span className="icon-badge">
          <Icon name="map" size={22} />
        </span>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
            Spatial Mapping Module
          </strong>
          <p>
            Interactive map rendering requires validated mandi latitude & longitude coordinates.
            {hasKey
              ? ' A Google Maps API key is detected in your environment and will activate once coordinates are ingested.'
              : ' To activate live geospatial rendering in future updates, specify VITE_GOOGLE_MAPS_API_KEY in your .env configuration.'}
          </p>
        </div>
      </div>
    </section>
  )
}
