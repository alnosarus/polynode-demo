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
          <h2>Real-time network visibility</h2>
          <p>
            Track every node, route, and disruption across your supply chain —
            powered by live data and causal prediction
          </p>
        </div>
      </div>

      {/* Predictive alerts carousel */}
      <AlertsShowcase />

      {/* CTA */}
      <div className="explore-cta">
        <a href="mailto:hello@polynode.com" className="btn btn-primary btn-lg">
          Request Early Access
        </a>
      </div>
    </div>
  )
}

export default Explore
