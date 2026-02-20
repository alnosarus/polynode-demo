function EarlyWarningIcon() {
  return (
    <div className="solution-icon-wrapper">
      <svg className="solution-icon icon-bell" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="bell-pulse-ring" cx="24" cy="24" r="20" stroke="#FF5252" strokeWidth="1.5" opacity="0" />
        <circle className="bell-pulse-ring ring-2" cx="24" cy="24" r="16" stroke="#FF5252" strokeWidth="1" opacity="0" />
        <path className="bell-body" d="M24 6C17.373 6 12 11.373 12 18v8l-3 4h30l-3-4v-8c0-6.627-5.373-12-12-12z" fill="none" stroke="#FF5252" strokeWidth="2" strokeLinejoin="round" />
        <path d="M20 34c0 2.209 1.791 4 4 4s4-1.791 4-4" fill="none" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function CascadeIcon() {
  return (
    <div className="solution-icon-wrapper">
      <svg className="solution-icon icon-cascade" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line className="cascade-line line-1" x1="14" y1="14" x2="24" y2="24" stroke="#2a2e35" strokeWidth="2" />
        <line className="cascade-line line-2" x1="34" y1="14" x2="24" y2="24" stroke="#2a2e35" strokeWidth="2" />
        <line className="cascade-line line-3" x1="24" y1="24" x2="14" y2="34" stroke="#2a2e35" strokeWidth="2" />
        <line className="cascade-line line-4" x1="24" y1="24" x2="34" y2="34" stroke="#2a2e35" strokeWidth="2" />
        <line className="cascade-line line-5" x1="24" y1="24" x2="24" y2="38" stroke="#2a2e35" strokeWidth="2" />
        <circle className="cascade-node node-origin" cx="24" cy="12" r="5" fill="#FF5252" />
        <circle className="cascade-node node-1" cx="14" cy="14" r="4" fill="#00C853" />
        <circle className="cascade-node node-2" cx="34" cy="14" r="4" fill="#00C853" />
        <circle className="cascade-node node-3" cx="24" cy="24" r="4.5" fill="#00C853" />
        <circle className="cascade-node node-4" cx="14" cy="34" r="4" fill="#00C853" />
        <circle className="cascade-node node-5" cx="34" cy="34" r="4" fill="#00C853" />
        <circle className="cascade-node node-6" cx="24" cy="38" r="3.5" fill="#00C853" />
      </svg>
    </div>
  )
}

function RecommendationIcon() {
  return (
    <div className="solution-icon-wrapper">
      <svg className="solution-icon icon-checklist" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="32" height="8" rx="2" fill="#14161A" stroke="#2a2e35" strokeWidth="1" />
        <path className="check check-1" d="M12 12l2 2 4-4" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="22" y="11" width="14" height="2" rx="1" fill="#3D434D" />
        <rect x="8" y="20" width="32" height="8" rx="2" fill="#14161A" stroke="#2a2e35" strokeWidth="1" />
        <path className="check check-2" d="M12 24l2 2 4-4" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="22" y="23" width="14" height="2" rx="1" fill="#3D434D" />
        <rect x="8" y="32" width="32" height="8" rx="2" fill="#14161A" stroke="#2a2e35" strokeWidth="1" />
        <path className="check check-3" d="M12 36l2 2 4-4" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="22" y="35" width="14" height="2" rx="1" fill="#3D434D" />
      </svg>
    </div>
  )
}

function Solution() {
  return (
    <section id="solution" className="section">
      <h2 className="section-title">The solution</h2>
      <p className="section-text">
        Polynode ingests your supply chain data alongside real-time government and market
        feeds — NWS weather alerts, FEMA disasters, EIA energy data, freight indices —
        and predicts disruptions before they cascade.
      </p>

      <div className="solution-cards">
        {/* Card 1: Early Warning */}
        <div className="solution-card">
          <EarlyWarningIcon />
          <h3 className="solution-card-title">Early Warning</h3>
          <p className="solution-card-text">
            Our GAT-LSTM model analyzes 68 supply chain nodes across 24/48/72h horizons
            with 90%+ AUROC accuracy.
          </p>
          <div className="solution-mockup">
            <div className="mockup-alert">
              <div className="mockup-alert-header">
                <span className="mockup-severity mockup-severity-critical">CRITICAL</span>
                <span className="mockup-source">NWS</span>
              </div>
              <div className="mockup-alert-title">Winter Storm Warning &mdash; I-35 TX Corridor</div>
              <div className="mockup-alert-details">
                <span className="mockup-alert-impact">$380K at risk &middot; 35 trucks in transit</span>
                <span>Affects: <strong>Dallas DC, Houston DC, ERCOT Grid</strong></span>
              </div>
              <div className="mockup-alert-prediction">
                <span className="mockup-pred-label">24h risk</span>
                <span className="mockup-pred-inline-bar"><span style={{ width: '78%' }} /></span>
                <span className="mockup-pred-inline-pct">78%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Cascade Prediction */}
        <div className="solution-card">
          <CascadeIcon />
          <h3 className="solution-card-title">Cascade Prediction</h3>
          <p className="solution-card-text">
            See how failures propagate through your 268-edge supply chain graph in real time.
          </p>
          <div className="solution-mockup">
            <div className="mockup-cascade">
              <div className="cascade-step">
                <span className="cascade-dot cascade-dot-red" />
                <span>Port LA/LB</span>
              </div>
              <span className="cascade-arrow">&rarr;</span>
              <div className="cascade-step">
                <span className="cascade-dot cascade-dot-orange" />
                <span>BNSF Transcon</span>
              </div>
              <span className="cascade-arrow">&rarr;</span>
              <div className="cascade-step">
                <span className="cascade-dot cascade-dot-yellow" />
                <span>Chicago DC</span>
              </div>
              <span className="cascade-arrow">&rarr;</span>
              <div className="cascade-step cascade-step-impact">
                <span>-$4.8M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Actionable Recommendations */}
        <div className="solution-card">
          <RecommendationIcon />
          <h3 className="solution-card-title">Actionable Recommendations</h3>
          <p className="solution-card-text">
            Prioritized actions ranked by ROI with cost-of-inaction analysis.
          </p>
          <div className="solution-mockup">
            <div className="mockup-recommendation">
              <div className="mockup-rec-header">
                <span className="mockup-rec-label">RECOMMENDED ACTION</span>
                <span className="mockup-rec-priority">CRITICAL</span>
              </div>
              <div className="mockup-rec-action">Reroute Dallas-Houston shipments via I-20/I-30</div>
              <div className="mockup-rec-stats">
                <span className="mockup-rec-save">Saves $127K</span>
                <span className="mockup-rec-cost">Inaction: $380K</span>
              </div>
              <div className="mockup-rec-nodes">
                <span className="mockup-rec-tag">Dallas DC</span>
                <span className="mockup-rec-tag">Houston DC</span>
                <span className="mockup-rec-tag">I-35 TX</span>
              </div>
              <button className="mockup-rec-btn">Execute Action</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Solution
