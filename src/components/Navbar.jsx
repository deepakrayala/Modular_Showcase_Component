import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, serverOnline, checkServer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">◆</span>
          <span className="brand-text">CompShowcase</span>
        </Link>

        {user && (
          <div className="navbar-links">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to="/components"
              className={`nav-link ${isActive("/components") ? "active" : ""}`}
            >
              Components
            </Link>
            {(user.roleId === 2 || user.roleId === 3) && (
              <Link
                to="/admin"
                className={`nav-link ${isActive("/admin") ? "active" : ""}`}
              >
                Admin
              </Link>
            )}
          </div>
        )}

        <div className="navbar-right">
          <div
            className={`server-status ${
              serverOnline === null ? "status-unknown" : serverOnline ? "status-online" : "status-offline"
            }`}
            title={
              serverOnline === null
                ? "Checking server..."
                : serverOnline
                ? "Backend connected"
                : "Backend offline"
            }
            onClick={() => checkServer()}
          >
            <span className="status-dot" />
            <span className="status-label">
              {serverOnline === null ? "..." : serverOnline ? "Online" : "Offline"}
            </span>
          </div>
          {user ? (
            <div className="user-section">
              <span className="user-greeting">Hi, {user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="btn-signup-nav">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
