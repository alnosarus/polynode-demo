import { useEffect } from 'react'
import DemoMap from '../components/DemoMap'
import AlertsShowcase from '../components/AlertsShowcase'

function Explore() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="explore-page">
      {/* Interactive 3D map */}
      <div className="explore-map-section">
        <DemoMap />
        <div className="explore-map-header">
          <h2>68-node supply chain graph</h2>
          <p>
            Track ports, rail yards, distribution centers, and freight corridors
            across the US — powered by GAT-LSTM prediction
          </p>
        </div>
      </div>

      {/* Predictive alerts carousel */}
      <AlertsShowcase />

      {/* CTA */}
      <div className="explore-cta">
        <a href="mailto:seth@polynode.com" className="btn btn-primary btn-lg">
          Request Early Access
        </a>
      </div>
    </div>
  )
}

export default Explore
