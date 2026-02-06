import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src="/logo.png" alt="Polynode" className="navbar-logo-img" />
      </div>

      {/* Navigation Items */}
      <div className="navbar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">&#9632;</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">&#9670;</span>
          <span>Explore</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
