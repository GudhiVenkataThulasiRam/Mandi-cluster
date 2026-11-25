import { fmt } from '../utils.js'
import Icon from './Icon.jsx'

export default function SummaryCards({ markets }) {
  const prices = markets.map((m) => m.avgPrice).filter((v) => v != null)
  const arrivals = markets.map((m) => m.avgArrival).filter((v) => v != null)
  const clusters = new Set(markets.map((m) => m.cluster).filter((v) => v != null))
  const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null)
  const price = (v) => (v == null ? '—' : `₹${fmt(v, 2)}`)

  const cards = [
    {
      icon: 'store',
      label: 'Matching Markets',
      value: markets.length,
      sub: 'Top ranked by price',
      theme: 'emerald'
    },
    {
      icon: 'up',
      label: 'Highest Avg Price',
      value: price(prices.length ? Math.max(...prices) : null),
      sub: '₹/quintal benchmark',
      theme: 'green'
    },
    {
      icon: 'down',
      label: 'Lowest Avg Price',
      value: price(prices.length ? Math.min(...prices) : null),
      sub: '₹/quintal floor',
      theme: 'amber'
    },
    {
      icon: 'truck',
      label: 'Average Market Arrival',
      value: fmt(avg(arrivals), 1),
      sub: 'Historical volume unit',
      theme: 'blue'
    },
    {
      icon: 'layers',
      label: 'Clusters Represented',
      value: clusters.size,
      sub: 'Distinct pattern groups',
      theme: 'violet'
    },
  ]

  return (
    <div className="summary-grid" aria-label="Key Performance Indicators">
      {cards.map((c) => (
        <div className="card stat" key={c.label}>
          <div className="stat-top">
            <span className="stat-label">{c.label}</span>
            <span className="icon-badge sm">
              <Icon name={c.icon} size={18} />
            </span>
          </div>
          <span className="stat-value">{c.value}</span>
          <span className="stat-sub">{c.sub}</span>
        </div>
      ))}
    </div>
  )
}
