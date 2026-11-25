
import Icon from './Icon.jsx'

export default function Navbar({ onDashboard }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#/" className="brand" aria-label="MandiCluster home">
          <div className="brand-logo-wrap">
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#0b3b29" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <path
                d="M16 25V13M16 17c-4 0-6-2-6-6 4 0 6 2 6 6zm0 2c4 0 6-2 6-6-4 0-6 2-6 6z"
                stroke="#86efac"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">MandiCluster</span>
            <span className="brand-subtitle">Agri-Market Analytics</span>
          </div>
        </a>

        <div className="nav-center">
          <div className="status-badge" title="Flask Backend & K-Means Service">
            <span className="status-dot" aria-hidden="true" />
            <span className="status-text">K-Means Active</span>
          </div>
        </div>

        <nav className="nav-links" aria-label="Main Navigation">
          {onDashboard ? (
            <a href="#/" className="btn btn-small btn-ghost" aria-label="Back to Home">
              <Icon name="arrowLeft" size={16} />
              <span>Back to Home</span>
            </a>
          ) : (
            <a href="#/dashboard" className="btn btn-small nav-link-primary" aria-label="Explore Dashboard">
              <Icon name="chart" size={16} />
              <span>Dashboard</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
