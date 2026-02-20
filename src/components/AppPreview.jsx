function PredCard({ name, border, badge, badgeText, bars, revenue, factor }) {
  return (
    <div className={`cc-pred-card border-${border}`}>
      <div className="cc-pred-header">
        <span className="cc-pred-name">{name}</span>
        <span className={`cc-severity-badge ${badge}`}>{badgeText}</span>
      </div>
      <div className="cc-risk-bars">
        {bars.map(b => (
          <div className="cc-risk-bar" key={b.h}>
            <span className="cc-risk-label">{b.h}</span>
            <div className="cc-risk-track"><div className={`cc-risk-fill ${b.c}`} style={{ width: `${b.w}%` }} /></div>
            <span className="cc-risk-pct">{b.w}%</span>
          </div>
        ))}
      </div>
      <div className="cc-pred-meta">
        <span className="cc-pred-revenue">{revenue}</span>
        <span className="cc-pred-factor">{factor}</span>
      </div>
    </div>
  )
}

function RecCard({ border, priority, confidence, action, nodes, savings, shipments, inaction }) {
  return (
    <div className={`cc-rec-card border-${border}`}>
      <div className="cc-rec-top">
        <span className={`cc-rec-priority ${priority}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
        <div className="cc-rec-confidence">
          <div className="cc-confidence-bar"><div className="cc-confidence-fill" style={{ width: `${confidence}%` }} /></div>
          <span className="cc-confidence-pct">{confidence}%</span>
        </div>
      </div>
      <p className="cc-rec-action">{action}</p>
      {nodes && (
        <div className="cc-rec-nodes-row">
          {nodes.map(n => <span className="cc-rec-node-tag" key={n}>{n}</span>)}
        </div>
      )}
      <div className="cc-rec-metrics">
        <span className="cc-rec-savings">{savings} saved</span>
        <span className="cc-rec-shipments">{shipments} shipments</span>
      </div>
      {inaction && <div className="cc-rec-inaction">Cost of inaction: {inaction}</div>}
      <div className="cc-rec-actions">
        <button className="cc-rec-btn-primary">Execute</button>
        <button className="cc-rec-btn-ghost">Snooze</button>
        {!inaction && <button className="cc-rec-btn-ghost">Dismiss</button>}
      </div>
    </div>
  )
}

function TimelineItem({ color, time, text }) {
  return (
    <div className="cc-timeline-item">
      <span className={`cc-tl-dot ${color}`} />
      <span className="cc-tl-time">{time}</span>
      <span className="cc-tl-text">{text}</span>
    </div>
  )
}

function AppPreview() {
  return (
    <section className="app-preview">
      <div className="app-preview-inner">
        <div className="app-preview-header">
          <h2 className="section-title">Your command center for supply chain operations</h2>
          <p className="section-text">
            One dashboard to monitor network health, predicted disruptions, and
            actionable recommendations — with exact cost-of-inaction estimates.
          </p>
        </div>

        <div className="browser-frame">
          <div className="browser-frame-bar">
            <div className="browser-dots">
              <span className="browser-dot dot-red" />
              <span className="browser-dot dot-yellow" />
              <span className="browser-dot dot-green" />
            </div>
            <div className="browser-url">
              <span>app.polynode.com/command</span>
            </div>
          </div>

          <div className="browser-frame-body">
            <div className="cc-app">
              {/* Top Bar */}
              <div className="cc-topbar">
                <div className="cc-topbar-logo">
                  <div className="cc-logo-icon">P</div>
                  <span className="cc-logo-text">Polynode</span>
                </div>
                <div className="cc-topbar-badges">
                  <span className="cc-badge-live">
                    <span className="cc-badge-dot green" />
                    LIVE
                  </span>
                  <span className="cc-badge-engine">GAT-LSTM</span>
                </div>
                <div className="cc-topbar-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <span>Search nodes, alerts...</span>
                  <kbd>&#8984;K</kbd>
                </div>
                <div className="cc-topbar-actions">
                  <div className="cc-bell">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    <span className="cc-bell-count">3</span>
                  </div>
                </div>
              </div>

              {/* Body — no sidebar, just command center + right panel */}
              <div className="cc-body">
                <div className="cc-main">
                  <div className="cc-view-header">
                    <div>
                      <h3 className="cc-view-title">Command Center</h3>
                      <p className="cc-view-sub">Supply Chain Operations &mdash; Executive Summary</p>
                    </div>
                    <div className="cc-data-sources">
                      <span className="cc-ds-badge">NWS</span>
                      <span className="cc-ds-badge">FEMA</span>
                      <span className="cc-ds-badge">EIA</span>
                      <span className="cc-ds-badge">BTS</span>
                    </div>
                  </div>

                  <div className="cc-kpi-grid">
                    <div className="cc-kpi-card">
                      <div className="cc-kpi-label">Network Health</div>
                      <div className="cc-kpi-row">
                        <svg className="cc-health-gauge" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1C1F26" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00C853" strokeWidth="3"
                            strokeDasharray="97.4" strokeDashoffset="5.7"
                            strokeLinecap="round" transform="rotate(-90 18 18)" />
                        </svg>
                        <span className="cc-kpi-value green">94.1%</span>
                      </div>
                    </div>
                    <div className="cc-kpi-card">
                      <div className="cc-kpi-label">Financial Exposure</div>
                      <div className="cc-kpi-value orange">$4.8M</div>
                    </div>
                    <div className="cc-kpi-card">
                      <div className="cc-kpi-label">Active Alerts</div>
                      <div className="cc-kpi-value red">3</div>
                    </div>
                    <div className="cc-kpi-card">
                      <div className="cc-kpi-label">Disruptions 24h</div>
                      <div className="cc-kpi-value orange">2</div>
                    </div>
                  </div>

                  <div className="cc-critical-strip">
                    <span className="cc-critical-icon">&#9888;</span>
                    <span>1 Critical Alert: Port congestion &mdash; LA/Long Beach</span>
                    <span className="cc-critical-badge">$500K at risk</span>
                  </div>

                  <div className="cc-two-col">
                    <div className="cc-panel-card">
                      <div className="cc-panel-title">
                        Predicted Failures
                        <span className="cc-count-badge warning">5</span>
                      </div>
                      <PredCard name="Port of LA/LB" border="red" badge="critical" badgeText="CRITICAL"
                        bars={[{h:'24h',w:82,c:'red'},{h:'48h',w:91,c:'red'},{h:'72h',w:95,c:'red'}]}
                        revenue="$500K" factor="vessel backlog, berth shortage" />
                      <PredCard name="I-35 Corridor TX" border="orange" badge="warning" badgeText="HIGH"
                        bars={[{h:'24h',w:65,c:'orange'},{h:'48h',w:78,c:'orange'},{h:'72h',w:84,c:'red'}]}
                        revenue="$320K" factor="winter storm, road closures" />
                      <PredCard name="ERCOT Grid TX" border="yellow" badge="caution" badgeText="WATCH"
                        bars={[{h:'24h',w:45,c:'yellow'},{h:'48h',w:58,c:'orange'},{h:'72h',w:67,c:'orange'}]}
                        revenue="$180K" factor="grid demand surge" />
                      <button className="cc-show-more">Show all 5 at-risk nodes</button>
                    </div>

                    <div className="cc-panel-card">
                      <div className="cc-panel-title">
                        Top Action Items
                        <span className="cc-count-badge blue">4</span>
                      </div>
                      <RecCard border="red" priority="critical" confidence={92}
                        action="Reroute LA/LB-bound freight through Port of Oakland. Activate backup carrier agreements."
                        nodes={['Port of LA/LB','Amazon Ontario DC','+2 more']}
                        savings="$420K" shipments={38} inaction="$500K" />
                      <RecCard border="orange" priority="high" confidence={87}
                        action="Pre-position inventory at Dallas DC ahead of I-35 winter storm. Estimated 48h window."
                        nodes={['Dallas IP','Target Dallas DC']}
                        savings="$280K" shipments={24} />
                      <RecCard border="yellow" priority="medium" confidence={74}
                        action="Switch ERCOT-dependent facilities to backup generators during peak demand window."
                        savings="$150K" shipments={12} />
                    </div>
                  </div>

                  <div className="cc-panel-card cc-timeline">
                    <div className="cc-panel-title">Activity Timeline</div>
                    <div className="cc-timeline-items">
                      <TimelineItem color="red" time="2m ago" text="Critical alert: Port congestion at LA/LB exceeded threshold" />
                      <TimelineItem color="orange" time="18m ago" text="NWS winter storm warning issued for I-35 TX corridor" />
                      <TimelineItem color="blue" time="45m ago" text="Recommendation executed: Memphis hub reroute completed" />
                      <TimelineItem color="green" time="1h ago" text="Network health restored: Boeing Everett node back to healthy" />
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <aside className="cc-right-panel">
                  <div className="cc-rp-section">
                    <div className="cc-rp-title">
                      Active Alerts
                      <span className="cc-count-badge red">3</span>
                    </div>
                    <div className="cc-rp-tabs">
                      <button className="cc-rp-tab active">All</button>
                      <button className="cc-rp-tab">Critical</button>
                      <button className="cc-rp-tab">Warning</button>
                    </div>
                    <div className="cc-alert-card border-red">
                      <div className="cc-alert-top">
                        <span className="cc-severity-badge critical">Critical</span>
                        <span className="cc-alert-source">NWS</span>
                      </div>
                      <div className="cc-alert-title">Port congestion &mdash; LA/Long Beach</div>
                      <div className="cc-alert-detail">8 vessels queued &middot; $500K at risk</div>
                      <div className="cc-alert-nodes">
                        <span className="cc-alert-node">Port of LA/LB</span>
                        <span className="cc-alert-node">BNSF LA ICTF</span>
                      </div>
                    </div>
                    <div className="cc-alert-card border-orange">
                      <div className="cc-alert-top">
                        <span className="cc-severity-badge warning">Warning</span>
                        <span className="cc-alert-source">NWS</span>
                      </div>
                      <div className="cc-alert-title">Winter storm &mdash; I-35 TX</div>
                      <div className="cc-alert-detail">35 trucks in transit &middot; $320K at risk</div>
                    </div>
                    <div className="cc-alert-card border-yellow">
                      <div className="cc-alert-top">
                        <span className="cc-severity-badge caution">Watch</span>
                        <span className="cc-alert-source">EIA</span>
                      </div>
                      <div className="cc-alert-title">ERCOT grid stress</div>
                      <div className="cc-alert-detail">4 facilities affected &middot; $180K at risk</div>
                    </div>
                  </div>

                  <div className="cc-rp-section">
                    <div className="cc-rp-title">
                      Predicted Disruptions
                      <span className="cc-count-badge warning">5</span>
                    </div>
                    <div className="cc-rp-pred">
                      <div className="cc-rp-pred-top">
                        <span className="cc-rp-pred-name">Port of LA/LB</span>
                        <span className="cc-severity-badge critical sm">CRITICAL</span>
                      </div>
                      <div className="cc-risk-bars compact">
                        <div className="cc-risk-bar">
                          <span className="cc-risk-label">24h</span>
                          <div className="cc-risk-track"><div className="cc-risk-fill red" style={{ width: '82%' }} /></div>
                          <span className="cc-risk-pct">82%</span>
                        </div>
                        <div className="cc-risk-bar">
                          <span className="cc-risk-label">48h</span>
                          <div className="cc-risk-track"><div className="cc-risk-fill red" style={{ width: '91%' }} /></div>
                          <span className="cc-risk-pct">91%</span>
                        </div>
                        <div className="cc-risk-bar">
                          <span className="cc-risk-label">72h</span>
                          <div className="cc-risk-track"><div className="cc-risk-fill red" style={{ width: '95%' }} /></div>
                          <span className="cc-risk-pct">95%</span>
                        </div>
                      </div>
                    </div>
                    <div className="cc-rp-pred">
                      <div className="cc-rp-pred-top">
                        <span className="cc-rp-pred-name">I-35 Corridor TX</span>
                        <span className="cc-severity-badge warning sm">HIGH</span>
                      </div>
                      <div className="cc-risk-bars compact">
                        <div className="cc-risk-bar">
                          <span className="cc-risk-label">24h</span>
                          <div className="cc-risk-track"><div className="cc-risk-fill orange" style={{ width: '65%' }} /></div>
                          <span className="cc-risk-pct">65%</span>
                        </div>
                        <div className="cc-risk-bar">
                          <span className="cc-risk-label">48h</span>
                          <div className="cc-risk-track"><div className="cc-risk-fill orange" style={{ width: '78%' }} /></div>
                          <span className="cc-risk-pct">78%</span>
                        </div>
                        <div className="cc-risk-bar">
                          <span className="cc-risk-label">72h</span>
                          <div className="cc-risk-track"><div className="cc-risk-fill red" style={{ width: '84%' }} /></div>
                          <span className="cc-risk-pct">84%</span>
                        </div>
                      </div>
                    </div>
                    <button className="cc-show-more">Show all 5 at-risk nodes</button>
                  </div>

                  <div className="cc-rp-section">
                    <div className="cc-rp-title">
                      Recommendations
                      <span className="cc-count-badge blue">4</span>
                    </div>
                    <div className="cc-rp-rec border-red">
                      <div className="cc-rec-top">
                        <span className="cc-rec-priority critical">Critical</span>
                        <div className="cc-rec-confidence">
                          <div className="cc-confidence-bar"><div className="cc-confidence-fill" style={{ width: '92%' }} /></div>
                          <span className="cc-confidence-pct">92%</span>
                        </div>
                      </div>
                      <p className="cc-rp-rec-text">Reroute LA/LB freight through Oakland</p>
                      <div className="cc-rec-metrics compact">
                        <span className="cc-rec-savings">$420K saved</span>
                        <span className="cc-rec-shipments">38 shipments</span>
                      </div>
                    </div>
                    <div className="cc-rp-rec border-orange">
                      <div className="cc-rec-top">
                        <span className="cc-rec-priority high">High</span>
                        <div className="cc-rec-confidence">
                          <div className="cc-confidence-bar"><div className="cc-confidence-fill" style={{ width: '87%' }} /></div>
                          <span className="cc-confidence-pct">87%</span>
                        </div>
                      </div>
                      <p className="cc-rp-rec-text">Pre-position inventory at Dallas DC</p>
                      <div className="cc-rec-metrics compact">
                        <span className="cc-rec-savings">$280K saved</span>
                        <span className="cc-rec-shipments">24 shipments</span>
                      </div>
                    </div>
                  </div>

                  <div className="cc-rp-footer">
                    <span><kbd>&#8984;K</kbd> Search</span>
                    <span><kbd>1-9</kbd> Navigate</span>
                    <span><kbd>?</kbd> Shortcuts</span>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppPreview
