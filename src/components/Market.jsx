function Market() {
  return (
    <section className="market">
      <div className="market-content">
        <h2 className="section-title">Who we serve</h2>
        <p className="section-text">
          We're starting with food and beverage distributors—companies that lose
          thousands annually to spoilage and delays. Competitors only serve Fortune 500
          at $100K+. We serve the mid-market at $20K/year.
        </p>

        <div className="market-highlight">
          <div className="market-highlight-item">
            <div className="market-highlight-value">$100K+</div>
            <div className="market-highlight-label">Enterprise solutions</div>
          </div>
          <div className="market-highlight-item">
            <div className="market-highlight-value">$20K</div>
            <div className="market-highlight-label">Polynode pricing</div>
          </div>
          <div className="market-highlight-item">
            <div className="market-highlight-value">5x</div>
            <div className="market-highlight-label">More accessible</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Market
