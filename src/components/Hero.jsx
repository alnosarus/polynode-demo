import ParticleBackground from './ParticleBackground'

function Hero() {
  return (
    <section className="section hero">
      <ParticleBackground />
      <div className="hero-content">
        <h1 className="hero-title">
          Predict disruptions{' '}
          <span className="hero-highlight">before they cause damage</span>
        </h1>
        <p className="hero-subtitle">
          Polynode connects your data with real-time infrastructure signals to alert you 24-72 hours before disruptions hit.
        </p>
      </div>
    </section>
  )
}

export default Hero
