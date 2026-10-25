import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if redirected after registration
  const registrationSuccess = location.state?.registeredMessage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(identifier, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'owner') navigate('/dashboard');
      else navigate('/properties');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid User ID/Email or Password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            {/* Main Login Card */}
            <div className="auth-card p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center text-white rounded-3 mb-3 shadow-sm"
                  style={{
                    width: '52px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)'
                  }}
                >
                  <i className="bi bi-shield-lock fs-3"></i>
                </div>
                <h3 className="fw-bold font-heading mb-1 text-dark">Welcome Back</h3>
                <p className="text-muted small mb-0">
                  Log in to access your HouseHunt account
                </p>
              </div>

              {registrationSuccess && (
                <div className="alert alert-success d-flex align-items-center py-2 px-3 small mb-3 rounded-3">
                  <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                  <div>{registrationSuccess}</div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger d-flex align-items-center py-2 px-3 small mb-3 rounded-3">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* User ID or Email */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">
                    User ID or Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Enter your username or email"
                      required
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                  <div className="form-text small text-muted">
                    Your registered username or email in MongoDB
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-secondary mb-0">
                      Password
                    </label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control border-start-0 border-end-0"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-light border border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMeCheck"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label small text-secondary" htmlFor="rememberMeCheck">
                      Remember me
                    </label>
                  </div>
                  <span className="small text-muted">
                    <i className="bi bi-shield-check text-success me-1"></i> MongoDB Secured
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Verifying credentials...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <hr className="my-4 text-muted opacity-25" />

              {/* Link to Register */}
              <div className="text-center small text-secondary">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Create New Account
                </Link>
              </div>

              {/* Security Footnote */}
              <div className="mt-4 pt-2 text-center text-muted small border-top">
                <i className="bi bi-database-check text-primary me-1"></i>
                <span className="opacity-75">Saved & verified securely in MongoDB database</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
