import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { COLORS, clusterColor, tooltipStyle } from '../chartTheme.js'
import { fmt } from '../utils.js'
import { computeClusterPersonas } from '../services/clusterPersona.js'

export default function ClusterAnalysis({ markets }) {
  // Built only from the markets returned for this search query
  const groups = {}
  markets.forEach((m) => {
    if (m.cluster != null) {
      ;(groups[m.cluster] ||= []).push(m)
    }
  })

  const personas = useMemo(() => computeClusterPersonas(markets), [markets])

  const avg = (arr, k) => {
    const v = arr.map((m) => m[k]).filter((x) => x != null)
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
  }

  const rows = Object.entries(groups)
    .map(([c, arr]) => {
      const persona = personas[c] || {}
      return {
        id: c,
        cluster: `Cluster ${c}`,
        personaName: persona.personaName || `Cluster ${c}`,
        tag: persona.tag || 'Market Segment',
        description: persona.description || 'Similar historical price and arrival behavior.',
        recommendation: persona.recommendation || '',
        count: arr.length,
        price: avg(arr, 'avgPrice'),
        arrival: avg(arr, 'avgArrival'),
      }
    })
    .sort((a, b) => a.cluster.localeCompare(b.cluster))

  if (!rows.length) return null

  return (
    <section className="card" aria-label="Machine learning cluster analysis">
      <div className="card-head">
        <div>
          <h2>K-Means Cluster Personas & Market Segmentation</h2>
          <p className="muted">
            Machine learning has categorized matching mandis into distinct behavioral profiles based on historical prices, arrivals, and volatility.
          </p>
        </div>
      </div>

      <div className="cluster-cards">
        {rows.map((r) => (
          <article
            className="cluster-card"
            key={r.id}
            style={{ '--c': clusterColor(r.id) }}
          >
            <div className="cluster-card-header">
              <div>
                <span className="cluster-card-id">{r.cluster}</span>
                <h3 className="cluster-persona-title">{r.personaName}</h3>
              </div>
              <span className="pill" style={{ '--c': clusterColor(r.id) }}>
                {r.count} {r.count === 1 ? 'Mandi' : 'Mandis'}
              </span>
            </div>

            <p className="cluster-card-tag">{r.tag}</p>

            <dl className="cluster-stats-grid">
              <div>
                <dt>Avg Price</dt>
                <dd>{r.price == null ? '—' : `₹${fmt(r.price, 0)}`}</dd>
              </div>
              <div>
                <dt>Avg Arrival</dt>
                <dd>{fmt(r.arrival, 1)}</dd>
              </div>
              <div>
                <dt>Market Share</dt>
                <dd>{Math.round((r.count / markets.length) * 100)}%</dd>
              </div>
            </dl>

            <p className="cluster-card-desc">{r.description}</p>

            {r.recommendation && (
              <div className="cluster-recommendation-box">
                <span className="cluster-rec-badge">Actionable Tip</span>
                <p>{r.recommendation}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <h3 className="sub">Market Count Distribution by Cluster</h3>
      <div className="chart-body" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
            <XAxis
              dataKey="cluster"
              stroke={COLORS.axis}
              fontSize={12}
              tickLine={false}
              tickFormatter={(v, idx) => `${v} (${rows[idx]?.personaName || ''})`}
            />
            <YAxis allowDecimals={false} stroke={COLORS.axis} fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'rgba(22, 163, 74, 0.06)' }}
              formatter={(value, name, props) => [
                `${value} mandis`,
                props.payload.personaName ? `${props.payload.cluster} (${props.payload.personaName})` : name,
              ]}
            />
            <Bar dataKey="count" name="Markets in Cluster" radius={[6, 6, 0, 0]}>
              {rows.map((r) => (
                <Cell key={r.id} fill={clusterColor(r.id)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
