import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation();

  let userRole = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role;
    } catch (error) {
      console.log("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-logo-badge">Hf</div>
          <div className="brand-name">
            Hire<span>Flow</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop & Mobile Links Wrapper */}
        <div className={`navbar-content ${mobileMenuOpen ? "open" : ""}`}>
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-item ${isActive("/") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-label">Home</span>
            </Link>

            <Link
              to="/jobs"
              className={`nav-item ${isActive("/jobs") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-label">Jobs</span>
            </Link>

            {userRole === "jobseeker" && (
              <Link
                to="/my-applications"
                className={`nav-item ${isActive("/my-applications") ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-label">My Applications</span>
              </Link>
            )}

            {userRole === "employer" && (
              <Link
                to="/employer/jobs"
                className={`nav-item ${isActive("/employer/jobs") ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-label">My Jobs</span>
              </Link>
            )}
          </div>

          <div className="navbar-auth">
            {token ? (
              <div className="auth-user-section">
                <span className="role-tag">
                  {userRole === "employer" ? "🏢 Employer" : "👤 Job Seeker"}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-guest-section">
                <Link
                  to="/login"
                  className="btn-signin"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-join"
                  onClick={closeMobileMenu}
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
