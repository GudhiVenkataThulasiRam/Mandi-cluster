import Hero from '../components/Hero.jsx'
import Icon from '../components/Icon.jsx'

const FEATURES = [
  [
    'scale',
    'Compare Agricultural Markets',
    'Evaluate average modal prices, median levels, price ranges, and incoming arrivals for mandis across your region.',
  ],
  [
    'cluster',
    'Understand Market Clusters',
    'K-Means machine learning groups mandis exhibiting similar pricing patterns and volatility profiles.',
  ],
  [
    'pin',
    'Explore State & District Mandis',
    'Filter by state, commodity, and optional district from verified agricultural data records.',
  ],
  [
    'chart',
    'Historical Insights & Trends',
    'Every statistic is computed from verified historical transaction data to empower smarter trading decisions.',
  ],
]

const STEPS = [
  [
    'Select your state and commodity',
    'Pick where your crops are harvested and select the commodity. Add an optional district to zoom into local mandis.',
  ],
  [
    'Explore ranked agricultural markets',
    'The engine computes price distributions and presents the top mandis sorted by historical average price.',
  ],
  [
    'Benchmark prices, arrivals & clusters',
    'Use interactive side-by-side comparisons, distribution charts, and cluster segmentation to guide your logistics.',
  ],
]

export default function Home() {
  return (
    <>
      <Hero />

      <section className="container section" id="features">
        <div className="section-head">
          <h2>Data-Driven Agricultural Decisions</h2>
          <p>
            Key analytical capabilities designed to help farmers and traders maximize price realization.
          </p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(([icon, t, d]) => (
            <article className="card feature" key={t}>
              <span className="icon-badge">
                <Icon name={icon} size={22} />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steps-band" id="how">
        <div className="container section">
          <div className="section-head">
            <h2>How It Works</h2>
            <p>From commodity selection to comprehensive market benchmarking in three straightforward steps.</p>
          </div>
          <ol className="steps">
            {STEPS.map(([t, d], i) => (
              <li className="card step" key={t}>
                <span className="step-num">{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container section cta">
        <div className="cta-box">
          <div>
            <h2>Ready to discover your optimal mandis?</h2>
            <p>Launch the interactive dashboard to compare historical prices and arrivals.</p>
          </div>
          <a href="#/dashboard" className="btn btn-light btn-lg">
            <Icon name="sparkles" size={18} />
            <span>Open Market Dashboard</span>
          </a>
        </div>
      </section>
    </>
  )
}
