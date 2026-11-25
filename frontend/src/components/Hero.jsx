import Icon from './Icon.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>Know Your Mandi Before You Load the Truck.</h1>
          <p className="lead">
            MandiCluster analyzes agricultural markets across India using historical modal prices and arrivals, grouping mandis with similar trading behavior through K-Means machine learning clustering.
          </p>
          <div className="hero-actions">
            <a href="#/dashboard" className="btn btn-lg">
              <Icon name="sparkles" size={18} />
              <span>Explore Markets</span>
            </a>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>How It Works</span>
              <Icon name="chevronDown" size={16} />
            </button>
          </div>
        </div>
        <svg className="hero-art" viewBox="0 0 420 340" role="img" aria-label="Illustration of a truck beside crop fields under the sun">
          <rect width="420" height="340" rx="22" fill="#E9F0D6" />
          <circle cx="330" cy="78" r="40" fill="#F2C94C" opacity=".9" />
          <path d="M0 200 Q110 150 210 190 T420 170 V340 H0Z" fill="#6AA84F" />
          <path d="M0 240 Q130 200 230 232 T420 215 V340 H0Z" fill="#2F7D4F" />
          <path d="M0 285 Q140 250 250 276 T420 262 V340 H0Z" fill="#14452F" />
          {[30, 82, 134, 186, 238, 290, 342, 394].map((x, i) => (
            <g key={x} stroke="#CFE5B8" strokeWidth="3" strokeLinecap="round" fill="none" opacity={i % 2 ? .7 : 1}>
              <path d={`M${x} 322V296`} /><path d={`M${x} 304q-10-3-12-13`} /><path d={`M${x} 304q10-3 12-13`} />
            </g>
          ))}
          <g transform="translate(60 138)">
            <rect x="0" y="14" width="86" height="46" rx="6" fill="#F7F4EA" />
            <path d="M86 26h24l14 16v18H86z" fill="#fff" /><path d="M96 31h13l8 11H96z" fill="#BFD9E3" />
            <rect x="8" y="22" width="70" height="8" rx="3" fill="#6AA84F" /><rect x="8" y="36" width="46" height="6" rx="3" fill="#CFE5B8" />
            <circle cx="26" cy="64" r="9" fill="#1D2A22" /><circle cx="26" cy="64" r="3.5" fill="#F7F4EA" />
            <circle cx="104" cy="64" r="9" fill="#1D2A22" /><circle cx="104" cy="64" r="3.5" fill="#F7F4EA" />
          </g>
          <g fill="#14452F"><rect x="236" y="118" width="26" height="30" rx="5" /><rect x="268" y="104" width="26" height="44" rx="5" /><rect x="300" y="126" width="26" height="22" rx="5" /></g>
          <path d="M226 150h110" stroke="#14452F" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  )
}
