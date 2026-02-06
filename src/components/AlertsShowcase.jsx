const showcaseAlerts = [
  {
    type: 'capacity',
    icon: '\u{1F4E6}',
    severity: 'high',
    urgency: 'Imminent',
    timeHorizon: 'In ~36 hours',
    title: 'Bedford Park DC Freezer Overflow Predicted',
    confidence: 94,
    causalFactors: ['Port inbound +22%', 'Outbound velocity -15%', 'Joliet 3PL at 78%'],
    predictedImpact: '$150K/day overflow costs'
  },
  {
    type: 'demand',
    icon: '\u{1F4C8}',
    severity: 'high',
    urgency: 'Imminent',
    timeHorizon: 'In ~3 days',
    title: 'Frozen Meal Demand Surge Expected at Jewel-Osco',
    confidence: 89,
    causalFactors: ['Winter storm advisory', 'Frozen sales +34% correlation'],
    predictedImpact: '$620K lost sales risk'
  },
  {
    type: 'disruption',
    icon: '\u{1F6A7}',
    severity: 'high',
    urgency: 'Imminent',
    timeHorizon: 'In ~48 hours',
    title: 'I-94 Dan Ryan Congestion Event Likely',
    confidence: 82,
    causalFactors: ['IDOT construction phase 3', 'Historical incident rate 3.2x'],
    predictedImpact: '3+ hour reefer truck delays'
  },
  {
    type: 'cold-chain',
    icon: '\u{1F321}\uFE0F',
    severity: 'high',
    urgency: 'Imminent',
    timeHorizon: 'In ~52 hours',
    title: 'Reefer Temperature Excursion Risk at Calumet Harbor',
    confidence: 91,
    causalFactors: ['Ambient temp 88F forecast', 'Avg dwell 3.1 days'],
    predictedImpact: '$1.2M product loss risk'
  },
  {
    type: 'supply',
    icon: '\u{1F3ED}',
    severity: 'medium',
    urgency: 'Developing',
    timeHorizon: 'In ~10 days',
    title: 'Banquet Production Shortfall Forecasted',
    confidence: 76,
    causalFactors: ['Soybean oil +12% trend', 'Margin compression signal'],
    predictedImpact: '$420K revenue shift'
  },
  {
    type: 'demand',
    icon: '\u{1F4C8}',
    severity: 'medium',
    urgency: 'Developing',
    timeHorizon: 'In ~4 days',
    title: 'Mariano\'s Reorder Trigger Approaching',
    confidence: 85,
    causalFactors: ['Sell-through +18% vs plan', 'Outbound queue 2.5 day lead'],
    predictedImpact: '$85K chargeback risk'
  }
]

function AlertsShowcase() {
  // Duplicate alerts for seamless infinite scroll
  const items = [...showcaseAlerts, ...showcaseAlerts]

  return (
    <section className="alerts-showcase">
      <div className="alerts-showcase-header">
        <h2 className="section-title">Live predictive alerts</h2>
        <p className="section-text">
          Real predictions from our causal model — not post-incident notifications
        </p>
      </div>

      <div className="alerts-slider-wrapper">
        <div className="alerts-slider-fade alerts-slider-fade-left" />
        <div className="alerts-slider-track">
          {items.map((alert, i) => (
            <div key={i} className={`showcase-card showcase-card-${alert.severity}`}>
              <div className="showcase-card-top">
                <span className="showcase-icon">{alert.icon}</span>
                <span className="showcase-type">{alert.type.replace('-', ' ')}</span>
                <span className={`showcase-urgency showcase-urgency-${alert.severity}`}>
                  {alert.urgency}
                </span>
              </div>

              <span className="showcase-horizon">{alert.timeHorizon}</span>

              <h4 className="showcase-title">{alert.title}</h4>

              <div className="showcase-confidence-row">
                <span className="showcase-confidence-label">Confidence</span>
                <span className="showcase-confidence-pct">{alert.confidence}%</span>
              </div>
              <div className="showcase-confidence-bar">
                <div
                  className={`showcase-confidence-fill ${alert.confidence >= 85 ? 'conf-high' : alert.confidence >= 70 ? 'conf-med' : 'conf-low'}`}
                  style={{ width: `${alert.confidence}%` }}
                />
              </div>

              <div className="showcase-tags">
                {alert.causalFactors.map((f, j) => (
                  <span key={j} className="showcase-tag">{f}</span>
                ))}
              </div>

              <div className="showcase-impact">
                <span className="showcase-impact-label">Impact:</span>
                <span className="showcase-impact-value">{alert.predictedImpact}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="alerts-slider-fade alerts-slider-fade-right" />
      </div>
    </section>
  )
}

export default AlertsShowcase
