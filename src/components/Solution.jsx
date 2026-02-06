function Solution() {
  const features = [
    {
      title: 'Early Warning',
      description: 'Alerts 24-72 hours before disruptions hit your supply chain.'
    },
    {
      title: 'Cascade Prediction',
      description: 'See how failures propagate across your supply chain network.'
    },
    {
      title: 'Actionable Recommendations',
      description: 'Know what to do, not just what\'s wrong.'
    }
  ]

  return (
    <section className="section">
      <h2 className="section-title">The solution</h2>
      <p className="section-text">
        Polynode ingests your supply chain data alongside hundreds of real-time
        external sources—rail networks, weather, port traffic, freight flows—to
        predict disruptions and recommend actions before they hit.
      </p>

      <div className="solution-cards">
        {features.map((feature, index) => (
          <div key={index} className="solution-card">
            <h3 className="solution-card-title">{feature.title}</h3>
            <p className="solution-card-text">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Solution
