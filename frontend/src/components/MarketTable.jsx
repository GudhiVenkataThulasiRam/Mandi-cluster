import { useMemo, useState } from 'react'
import { fmt } from '../utils.js'
import { clusterColor } from '../chartTheme.js'
import { computeClusterPersonas, getPersonaForCluster, getMarketBehaviorBadge } from '../services/clusterPersona.js'
import Icon from './Icon.jsx'

const COLS = [
  ['rank', 'Rank', false],
  ['market', 'Market Name', false],
  ['district', 'District', false],
  ['avgPrice', 'Average Price', true],
  ['medianPrice', 'Median Price', true],
  ['avgArrival', 'Avg Arrival', true],
  ['cluster', 'Cluster & Persona', false],
]

const Pill = ({ c, persona }) => {
  if (c == null) return '—'
  const personaName = persona?.personaName
  return (
    <div className="cluster-table-cell">
      <span className="pill" style={{ '--c': clusterColor(c) }}>
        Cluster {c}
      </span>
      {personaName && (
        <span className="cluster-cell-persona" style={{ color: clusterColor(c) }}>
          {personaName}
        </span>
      )}
    </div>
  )
}

// Convert price from per quintal to per kilogram
const pricePerKg = (price) =>
  price == null ? null : price / 100

// Display both price formats cleanly
const PriceDisplay = ({ price }) => (
  <div>
    <div className="price-quintal">
      ₹{fmt(price, 2)}
      <span className="muted" style={{ fontSize: '0.78rem', fontWeight: 'normal' }}> /qtl</span>
    </div>
    <span className="price-kg">
      ₹{fmt(pricePerKg(price), 2)} /kg
    </span>
  </div>
)

export default function MarketTable({ markets }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ key: 'rank', dir: 'asc' })

  const personas = useMemo(() => computeClusterPersonas(markets), [markets])

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()

    const f = s
      ? markets.filter((m) =>
          `${m.market} ${m.district}`.toLowerCase().includes(s)
        )
      : markets

    return [...f].sort((a, b) => {
      const x = a[sort.key]
      const y = b[sort.key]

      if (x == null) return 1
      if (y == null) return -1

      const c =
        typeof x === 'string'
          ? x.localeCompare(y)
          : x - y

      return sort.dir === 'asc' ? c : -c
    })
  }, [markets, q, sort])

  const toggle = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc',
    }))

  const arrow = (k) =>
    sort.key === k
      ? sort.dir === 'asc' ? ' ▲' : ' ▼'
      : ''

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank rank-top-1'
    if (rank === 2) return 'rank rank-top-2'
    if (rank === 3) return 'rank rank-top-3'
    return 'rank'
  }

  return (
    <section className="card" aria-label="Market recommendations table">
      <div className="card-head">
        <div>
          <h2>Market Rankings & Historical Pricing</h2>
          <p className="muted">
            Showing {rows.length} of {markets.length} markets. Select a column heading to sort.
          </p>
        </div>

        <div className="search-wrap">
          <Icon name="search" size={17} />
          <input
            className="search"
            type="search"
            placeholder="Search market or district…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search markets or districts"
          />
        </div>
      </div>

      <div className="mobile-sort">
        <label htmlFor="m-sort">Sort by</label>
        <select
          id="m-sort"
          value={sort.key}
          onChange={(e) =>
            setSort({ key: e.target.value, dir: 'asc' })
          }
        >
          {COLS.map(([k, l]) => (
            <option key={k} value={k}>{l}</option>
          ))}
        </select>

        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={() =>
            setSort((s) => ({
              ...s,
              dir: s.dir === 'asc' ? 'desc' : 'asc',
            }))
          }
          aria-label="Toggle sort direction"
        >
          {sort.dir === 'asc' ? 'Low to high' : 'High to low'}
        </button>
      </div>

      <div className="table-wrap desktop-only">
        <table>
          <thead>
            <tr>
              {COLS.map(([k, label, right]) => (
                <th
                  key={k}
                  className={right ? 'right' : ''}
                  aria-sort={
                    sort.key === k
                      ? sort.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <button
                    className="th-btn"
                    onClick={() => toggle(k)}
                  >
                    <span>{label}</span>
                    <span style={{ fontSize: '0.75rem', opacity: sort.key === k ? 1 : 0.4 }}>
                      {arrow(k) || ' ⇅'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((m, i) => {
              const persona = getPersonaForCluster(m.cluster, personas)
              const badge = getMarketBehaviorBadge(m, markets)

              return (
                <tr key={`${m.market}-${m.district}-${i}`}>
                  <td>
                    <span className={getRankClass(m.rank)}>{m.rank}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {m.market ?? '—'}
                      </strong>
                      {badge && (
                        <span className={`mandi-trait-badge ${badge.className}`} title={badge.tooltip}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {m.district ?? '—'}
                  </td>

                  <td className="right num">
                    <PriceDisplay price={m.avgPrice} />
                  </td>

                  <td className="right num">
                    <PriceDisplay price={m.medianPrice} />
                  </td>

                  <td className="right num" style={{ fontWeight: 600 }}>
                    {fmt(m.avgArrival, 1)}
                  </td>

                  <td>
                    <Pill c={m.cluster} persona={persona} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="market-cards mobile-only">
        {rows.map((m, i) => {
          const persona = getPersonaForCluster(m.cluster, personas)
          const badge = getMarketBehaviorBadge(m, markets)

          return (
            <li
              className="market-card"
              key={`${m.market}-${m.district}-${i}`}
            >
              <div className="mc-top">
                <span className={getRankClass(m.rank)}>{m.rank}</span>
                <div className="mc-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <strong>{m.market ?? '—'}</strong>
                    {badge && (
                      <span className={`mandi-trait-badge ${badge.className}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <span className="muted">
                    {m.district ?? '—'}
                  </span>
                </div>
                <Pill c={m.cluster} persona={persona} />
              </div>

              <dl className="mc-stats">
                <div>
                  <dt>Avg Price</dt>
                  <dd>
                    <PriceDisplay price={m.avgPrice} />
                  </dd>
                </div>

                <div>
                  <dt>Median Price</dt>
                  <dd>
                    <PriceDisplay price={m.medianPrice} />
                  </dd>
                </div>

                <div>
                  <dt>Avg Arrival</dt>
                  <dd style={{ marginTop: '0.35rem' }}>{fmt(m.avgArrival, 1)}</dd>
                </div>
              </dl>
            </li>
          )
        })}
      </ul>

      {rows.length === 0 && (
        <p className="empty">
          No markets match “{q}”. Clear the search filter to display all recommendations.
        </p>
      )}
    </section>
  )
}
