import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isOwner, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadgeColor = {
    admin: 'bg-danger text-white',
    owner: 'bg-primary text-white',
    renter: 'bg-success text-white'
  };

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded-3"
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
              }}
            >
              <i className="bi bi-building fs-5"></i>
            </div>
            <span className="fw-bold fs-4 tracking-tight font-heading" style={{ color: '#0f172a' }}>
              House<span style={{ color: '#4f46e5' }}>Hunt</span>
            </span>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link px-3 fw-semibold ${location.pathname === '/' ? 'text-primary' : 'text-secondary'}`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/properties"
                  className={`nav-link px-3 fw-semibold ${location.pathname.startsWith('/properties') ? 'text-primary' : 'text-secondary'}`}
                >
                  <i className="bi bi-search me-1"></i> Explore Rentals
                </Link>
              </li>
              {isAuthenticated && (
                <li className="nav-item">
                  <Link
                    to="/dashboard"
                    className={`nav-link px-3 fw-semibold ${location.pathname === '/dashboard' ? 'text-primary' : 'text-secondary'}`}
                  >
                    <i className="bi bi-grid-1x2 me-1"></i> Dashboard
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li className="nav-item">
                  <Link
                    to="/admin"
                    className={`nav-link px-3 fw-semibold text-danger ${location.pathname === '/admin' ? 'fw-bold' : ''}`}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Admin Moderation
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2">
              {/* Post Property Button for Landlords & Admins */}
              <Link
                to="/post-property"
                className="btn btn-outline-custom d-flex align-items-center gap-2 py-2 px-3"
              >
                <i className="bi bi-plus-circle text-primary"></i>
                <span>Post Listing</span>
              </Link>

              {isAuthenticated && user ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="dropdown">
                    <button
                      className="btn btn-light d-flex align-items-center gap-2 rounded-pill border px-3 py-1 dropdown-toggle shadow-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                        alt={user.name}
                        className="rounded-circle"
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                      />
                      <div className="text-start d-none d-sm-block" style={{ lineHeight: '1.2' }}>
                        <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '120px', fontSize: '0.85rem' }}>
                          {user.name ? user.name.split(' ')[0] : (user.username || 'User')}
                        </div>
                        <span className={`badge ${roleBadgeColor[user.role] || 'bg-secondary'}`} style={{ fontSize: '0.65rem' }}>
                          {user.role?.toUpperCase()}
                        </span>
                      </div>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2" style={{ minWidth: '220px' }}>
                      <li className="px-3 py-2 border-bottom mb-1">
                        <div className="fw-bold text-dark">{user.name || user.username}</div>
                        <div className="text-muted small text-truncate">{user.email}</div>
                      </li>
                      <li>
                        <Link to="/dashboard" className="dropdown-item rounded-2 py-2">
                          <i className="bi bi-speedometer2 me-2 text-primary"></i> My Dashboard
                        </Link>
                      </li>
                      {isAdmin && (
                        <li>
                          <Link to="/admin" className="dropdown-item rounded-2 py-2 text-danger">
                            <i className="bi bi-sliders me-2"></i> Admin Controls
                          </Link>
                        </li>
                      )}
                      <li>
                        <hr className="dropdown-divider my-1" />
                      </li>
                      <li>
                        <button onClick={handleLogout} className="dropdown-item rounded-2 py-2 text-danger">
                          <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Explicit Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger d-flex align-items-center gap-1 py-1 px-3 rounded-pill shadow-sm"
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                    title="Log Out of your account"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="d-none d-md-inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/login" className="btn btn-outline-custom py-2 px-3">
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary-custom py-2 px-3">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
