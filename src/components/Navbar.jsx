import { useState } from 'react'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        {/* Logo */}
        <a href="/" className="topnav-logo">
          <img src="/logo.png" alt="Polynode" className="topnav-logo-img" />
        </a>

        {/* Desktop Links */}
        <div className="topnav-links">
          <button onClick={() => scrollTo('hero')} className="topnav-link">Home</button>
          <button onClick={() => scrollTo('solution')} className="topnav-link">Product</button>
          <button onClick={() => scrollTo('pricing')} className="topnav-link">Pricing</button>
          <button onClick={() => scrollTo('footer')} className="topnav-link">Contact</button>
        </div>

        {/* CTA */}
        <a href="mailto:seth@polynode.com" className="topnav-cta">Get Started</a>

        {/* Mobile Hamburger */}
        <button
          className={`topnav-hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="topnav-mobile">
          <button onClick={() => scrollTo('hero')} className="topnav-mobile-link">Home</button>
          <button onClick={() => scrollTo('solution')} className="topnav-mobile-link">Product</button>
          <button onClick={() => scrollTo('pricing')} className="topnav-mobile-link">Pricing</button>
          <button onClick={() => scrollTo('footer')} className="topnav-mobile-link">Contact</button>
          <a href="mailto:seth@polynode.com" className="topnav-mobile-cta">Get Started</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar
