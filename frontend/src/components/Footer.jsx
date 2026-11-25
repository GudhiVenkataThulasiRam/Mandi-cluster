
export default function Footer({ onDashboard }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="brand-dot" />
              <strong>MandiCluster</strong>
            </div>
            <p className="footer-desc">
              Data-driven market intelligence & price-pattern segmentation for agricultural mandis across India, powered by historical records and K-Means machine learning clustering.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer Links">
            <span className="footer-nav-title">Quick Navigation</span>
            {onDashboard ? (
              <a href="#/">← Back to Home</a>
            ) : (
              <a href="#/dashboard">Market Dashboard →</a>
            )}
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} MandiCluster. Designed for farmers, traders, and agricultural analysts.
          </p>
          <div className="footer-disclaimer">
            <span>Note:</span> Historical figures reflect recorded mandi transactions. It illustrates past patterns and does not guarantee future market prices.
          </div>
        </div>
      </div>
    </footer>
  )
}
