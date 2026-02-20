import { Link } from 'react-router-dom'

function ProductShowcase() {
  return (
    <section id="product-showcase" className="product-showcase">
      <div className="product-showcase-inner">
        <div className="product-showcase-header">
          <h2 className="section-title">See your network in real time</h2>
          <p className="section-text">
            Every node, every route, every risk — live on one screen. Click any asset to see
            dependencies, status history, and predicted disruptions.
          </p>
        </div>

        {/* Browser frame mockup */}
        <div className="browser-frame">
          <div className="browser-frame-bar">
            <div className="browser-dots">
              <span className="browser-dot dot-red" />
              <span className="browser-dot dot-yellow" />
              <span className="browser-dot dot-green" />
            </div>
            <div className="browser-url">
              <span>app.polynode.com/map</span>
            </div>
          </div>
          <div className="browser-frame-body">
            <div className="mock-dashboard">
              {/* Sidebar - matches actual app: 8 nav items */}
              <div className="mock-sidebar">
                <div className="mock-sidebar-logo" />
                <div className="mock-sidebar-item" />
                <div className="mock-sidebar-item active" />
                <div className="mock-sidebar-item" />
                <div className="mock-sidebar-item" />
                <div className="mock-sidebar-item" />
                <div className="mock-sidebar-item" />
                <div className="mock-sidebar-item" />
                <div className="mock-sidebar-item" />
              </div>

              {/* Main map area */}
              <div className="mock-map">
                {/* Summary banner - matches real app KPIs */}
                <div className="mock-kpi-bar">
                  <div className="mock-kpi">
                    <span className="mock-kpi-value green">94.1%</span>
                    <span className="mock-kpi-label">Network Health</span>
                  </div>
                  <div className="mock-kpi">
                    <span className="mock-kpi-value">68</span>
                    <span className="mock-kpi-label">Active Nodes</span>
                  </div>
                  <div className="mock-kpi">
                    <span className="mock-kpi-value red">2</span>
                    <span className="mock-kpi-label">Failing</span>
                  </div>
                  <div className="mock-kpi">
                    <span className="mock-kpi-value orange">$4.8M</span>
                    <span className="mock-kpi-label">Revenue at Risk</span>
                  </div>
                </div>

                {/* Map with real node names from the actual app */}
                <div className="mock-map-area">
                  <svg className="mock-map-lines" viewBox="0 0 600 300" preserveAspectRatio="none">
                    {/* West coast routes */}
                    <line className="mock-route" x1="60" y1="130" x2="160" y2="110" />
                    <line className="mock-route route-alert" x1="60" y1="130" x2="120" y2="180" />
                    {/* I-10 / I-35 corridors */}
                    <line className="mock-route" x1="160" y1="110" x2="300" y2="150" />
                    <line className="mock-route" x1="120" y1="180" x2="260" y2="200" />
                    <line className="mock-route" x1="260" y1="200" x2="300" y2="150" />
                    {/* Midwest / East */}
                    <line className="mock-route" x1="300" y1="150" x2="420" y2="100" />
                    <line className="mock-route" x1="420" y1="100" x2="520" y2="80" />
                    <line className="mock-route" x1="300" y1="150" x2="440" y2="200" />
                    <line className="mock-route" x1="440" y1="200" x2="520" y2="140" />
                    {/* Southeast */}
                    <line className="mock-route" x1="260" y1="200" x2="400" y2="240" />
                  </svg>

                  {/* Real nodes from polynode_comp */}
                  <div className="mock-node mock-node-red" style={{ left: '8%', top: '40%' }}>
                    <span className="mock-node-pulse pulse-red" />
                    <span className="mock-node-label">Port of LA/LB</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '6%', top: '25%' }}>
                    <span className="mock-node-label">Salinas Valley</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '18%', top: '55%' }}>
                    <span className="mock-node-label">BNSF LA ICTF</span>
                  </div>
                  <div className="mock-node mock-node-yellow" style={{ left: '24%', top: '32%' }}>
                    <span className="mock-node-pulse" />
                    <span className="mock-node-label">Tesla Fremont</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '40%', top: '62%' }}>
                    <span className="mock-node-label">Dallas DC</span>
                  </div>
                  <div className="mock-node mock-node-orange" style={{ left: '42%', top: '42%' }}>
                    <span className="mock-node-label">ERCOT Grid</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '48%', top: '46%' }}>
                    <span className="mock-node-label">Chicago DC</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '65%', top: '28%' }}>
                    <span className="mock-node-label">Memphis Hub</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '82%', top: '22%' }}>
                    <span className="mock-node-label">NJ DC</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '68%', top: '60%' }}>
                    <span className="mock-node-label">Atlanta</span>
                  </div>
                  <div className="mock-node mock-node-green" style={{ left: '85%', top: '42%' }}>
                    <span className="mock-node-label">I-95 Corridor</span>
                  </div>
                </div>
              </div>

              {/* Right panel - matches actual app structure */}
              <div className="mock-alert-panel">
                <div className="mock-panel-header">Active Alerts</div>
                <div className="mock-panel-alert critical">
                  <div className="mock-panel-dot red" />
                  <div className="mock-panel-text">
                    <span className="mock-panel-title">Port congestion &mdash; LA/LB</span>
                    <span className="mock-panel-sub">NWS &middot; $500M at risk</span>
                  </div>
                </div>
                <div className="mock-panel-alert warning">
                  <div className="mock-panel-dot orange" />
                  <div className="mock-panel-text">
                    <span className="mock-panel-title">Winter storm &mdash; I-35 TX</span>
                    <span className="mock-panel-sub">NWS &middot; 35 trucks in transit</span>
                  </div>
                </div>
                <div className="mock-panel-alert info">
                  <div className="mock-panel-dot yellow" />
                  <div className="mock-panel-text">
                    <span className="mock-panel-title">ERCOT grid stress</span>
                    <span className="mock-panel-sub">EIA &middot; 4 facilities affected</span>
                  </div>
                </div>
                <div className="mock-panel-divider" />
                <div className="mock-panel-header" style={{ fontSize: '9px', paddingBottom: '4px', borderBottom: 'none' }}>Predictions</div>
                <div className="mock-panel-prediction">
                  <span className="mock-pred-name">I-35 TX</span>
                  <span className="mock-pred-bar">
                    <span className="mock-pred-fill" style={{ width: '78%' }} />
                  </span>
                  <span className="mock-pred-pct">78%</span>
                </div>
                <div className="mock-panel-prediction">
                  <span className="mock-pred-name">Port LA</span>
                  <span className="mock-pred-bar">
                    <span className="mock-pred-fill" style={{ width: '65%' }} />
                  </span>
                  <span className="mock-pred-pct">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="product-showcase-cta">
          <Link to="/demo" className="btn btn-primary btn-lg">
            Try the Live Demo
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase
