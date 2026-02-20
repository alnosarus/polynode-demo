function ConnectIcon() {
  return (
    <svg className="step-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Database/system icons connecting */}
      <rect className="hiw-db hiw-db-1" x="6" y="16" width="16" height="12" rx="2" fill="#1C1F26" stroke="#2A2E35" strokeWidth="1.5" />
      <line x1="10" y1="22" x2="18" y2="22" stroke="#3D434D" strokeWidth="1" />
      <line x1="10" y1="25" x2="16" y2="25" stroke="#3D434D" strokeWidth="1" />

      <rect className="hiw-db hiw-db-2" x="6" y="36" width="16" height="12" rx="2" fill="#1C1F26" stroke="#2A2E35" strokeWidth="1.5" />
      <line x1="10" y1="42" x2="18" y2="42" stroke="#3D434D" strokeWidth="1" />
      <line x1="10" y1="45" x2="16" y2="45" stroke="#3D434D" strokeWidth="1" />

      {/* Connection lines with animated data flow */}
      <path className="hiw-connect-line line-a" d="M22 22 L38 32" stroke="#2962FF" strokeWidth="1.5" strokeDasharray="4 3" />
      <path className="hiw-connect-line line-b" d="M22 42 L38 32" stroke="#2962FF" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Central Polynode node */}
      <circle cx="46" cy="32" r="12" fill="#1C1F26" stroke="#2962FF" strokeWidth="2" />
      <text x="46" y="36" textAnchor="middle" fill="#2962FF" fontSize="10" fontWeight="700">P</text>
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg className="step-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Map-like background */}
      <rect x="4" y="8" width="56" height="40" rx="4" fill="#1C1F26" stroke="#2A2E35" strokeWidth="1" />

      {/* Grid lines */}
      <line x1="4" y1="20" x2="60" y2="20" stroke="#1a1d24" strokeWidth="0.5" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="#1a1d24" strokeWidth="0.5" />
      <line x1="20" y1="8" x2="20" y2="48" stroke="#1a1d24" strokeWidth="0.5" />
      <line x1="40" y1="8" x2="40" y2="48" stroke="#1a1d24" strokeWidth="0.5" />

      {/* Signal nodes with pulse */}
      <circle className="hiw-signal sig-1" cx="15" cy="24" r="3" fill="#00C853" />
      <circle className="hiw-signal sig-2" cx="32" cy="18" r="3" fill="#00C853" />
      <circle className="hiw-signal sig-3" cx="48" cy="30" r="3" fill="#FFD740" />
      <circle className="hiw-signal sig-4" cx="25" cy="38" r="3" fill="#00C853" />
      <circle className="hiw-signal sig-5" cx="45" cy="40" r="3" fill="#FF5252" />

      {/* Connection lines */}
      <line x1="15" y1="24" x2="32" y2="18" stroke="#00C853" strokeWidth="1" opacity="0.4" />
      <line x1="32" y1="18" x2="48" y2="30" stroke="#FFD740" strokeWidth="1" opacity="0.4" />
      <line x1="25" y1="38" x2="45" y2="40" stroke="#FF5252" strokeWidth="1" opacity="0.4" />

      {/* Live data label */}
      <rect x="8" y="51" width="48" height="6" rx="3" fill="#0B0C0E" />
      <rect className="hiw-scan-bar" x="8" y="51" width="12" height="6" rx="3" fill="#2962FF" opacity="0.6" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="step-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Alert card */}
      <rect className="hiw-alert-card" x="8" y="6" width="48" height="52" rx="4" fill="#1C1F26" stroke="#2A2E35" strokeWidth="1" />

      {/* Alert header */}
      <rect x="12" y="10" width="40" height="10" rx="2" fill="#0B0C0E" />
      <circle className="hiw-alert-dot" cx="17" cy="15" r="3" fill="#FF5252" />
      <rect x="24" y="13" width="24" height="3" rx="1" fill="#3D434D" />

      {/* Content lines */}
      <rect x="12" y="24" width="36" height="2" rx="1" fill="#2A2E35" />
      <rect x="12" y="30" width="28" height="2" rx="1" fill="#2A2E35" />

      {/* Impact badge */}
      <rect x="12" y="36" width="18" height="6" rx="2" fill="rgba(255, 82, 82, 0.15)" />
      <rect x="14" y="38" width="14" height="2" rx="1" fill="#FF5252" opacity="0.6" />

      {/* Action button */}
      <rect className="hiw-action-btn" x="12" y="46" width="40" height="8" rx="3" fill="#2962FF" />
      <rect x="24" y="49" width="16" height="2" rx="1" fill="white" opacity="0.8" />
    </svg>
  )
}

function HowItWorks() {
  return (
    <section className="section">
      <h2 className="section-title">How it works</h2>

      <div className="how-it-works-steps">
        <div className="step">
          <div className="step-visual">
            <div className="step-number">1</div>
            <ConnectIcon />
          </div>
          <h3 className="step-title">Connect your data</h3>
          <p className="step-text">
            We integrate with your existing systems — ERP, TMS, WMS — in days, not months.
            Your data stays yours.
          </p>
        </div>

        <div className="step-connector">
          <svg viewBox="0 0 60 20" fill="none" className="connector-arrow">
            <line x1="0" y1="10" x2="50" y2="10" stroke="#2962FF" strokeWidth="2" strokeDasharray="6 4" />
            <polygon points="48,5 58,10 48,15" fill="#2962FF" />
          </svg>
        </div>

        <div className="step">
          <div className="step-visual">
            <div className="step-number">2</div>
            <MonitorIcon />
          </div>
          <h3 className="step-title">We monitor everything</h3>
          <p className="step-text">
            Real-time analysis of infrastructure signals across rail, ports, weather,
            freight, and government data feeds.
          </p>
        </div>

        <div className="step-connector">
          <svg viewBox="0 0 60 20" fill="none" className="connector-arrow">
            <line x1="0" y1="10" x2="50" y2="10" stroke="#2962FF" strokeWidth="2" strokeDasharray="6 4" />
            <polygon points="48,5 58,10 48,15" fill="#2962FF" />
          </svg>
        </div>

        <div className="step">
          <div className="step-visual">
            <div className="step-number">3</div>
            <AlertIcon />
          </div>
          <h3 className="step-title">Get alerts before impact</h3>
          <p className="step-text">
            Actionable warnings with enough lead time to reroute, reorder,
            or prepare — with exact cost estimates.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
