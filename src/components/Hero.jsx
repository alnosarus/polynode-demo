import ParticleBackground from './ParticleBackground'

function Hero() {
  return (
    <section id="hero" className="section hero">
      <ParticleBackground />
      <div className="hero-content">
        <h1 className="hero-title">
          Predict disruptions{' '}
          <span className="hero-highlight">before they cause damage</span>
        </h1>
        <p className="hero-subtitle">
          Polynode connects your supply chain data with real-time infrastructure signals — rail networks, weather, port traffic, freight flows — to predict disruptions 24-72 hours before they hit.
        </p>
        <div className="hero-actions">
          <a href="#product-showcase" className="btn btn-primary btn-lg hero-cta">
            See It In Action
          </a>
          <a href="mailto:seth@polynode.com" className="btn btn-secondary btn-lg">
            Get 3 Months Free
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
