function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Connect your data',
      description: 'We integrate with your existing systems—ERP, TMS, WMS—in days, not months.'
    },
    {
      number: 2,
      title: 'We monitor everything',
      description: 'Real-time analysis of infrastructure signals across rail, ports, weather, and freight.'
    },
    {
      number: 3,
      title: 'Get alerts before impact',
      description: 'Actionable warnings with enough time to reroute, reorder, or prepare.'
    }
  ]

  return (
    <section className="section">
      <h2 className="section-title">How it works</h2>

      <div className="how-it-works-steps">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-text">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
