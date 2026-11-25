
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [onDashboard, setOnDashboard] = useState(
    window.location.hash === '#/dashboard'
  )

  useEffect(() => {
    const handleRouteChange = () => {
      setOnDashboard(window.location.hash === '#/dashboard')
    }

    window.addEventListener('hashchange', handleRouteChange)

    return () => {
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [])

  return (
    <>
      <Navbar onDashboard={onDashboard} />

      <main>
        {onDashboard ? <Dashboard /> : <Home />}
      </main>

      <Footer onDashboard={onDashboard} />
    </>
  )
}
