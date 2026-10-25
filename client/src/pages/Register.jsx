import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('renter'); // 'renter', 'owner', or 'admin'
  const [adminSecret, setAdminSecret] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (role === 'admin' && adminSecret !== 'ADMIN2026') {
      setError('Invalid Admin Passkey. Only authorized managers can register as admin.');
      return;
    }

    setLoading(true);

    try {
      const user = await register({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        role,
        adminSecret: role === 'admin' ? adminSecret : undefined
      });

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'owner') navigate('/dashboard');
      else navigate('/properties');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please verify your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
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
                  <i className="bi bi-person-plus fs-3"></i>
                </div>
                <h3 className="fw-bold font-heading mb-1 text-dark">Create Your Account</h3>
                <p className="text-muted small mb-0">
                  Register a new ID to save directly to MongoDB
                </p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center py-2 px-3 small mb-3 rounded-3">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Role Selector Cards */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                    Select Account Persona
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <div
                        className={`role-select-card h-100 ${role === 'renter' ? 'selected' : ''}`}
                        onClick={() => setRole('renter')}
                      >
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <i className="bi bi-house-heart text-primary fs-5"></i>
                          <span className="fw-bold text-dark small">Tenant / Renter</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Browse listings, book viewings & rentals
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className={`role-select-card h-100 ${role === 'owner' ? 'selected' : ''}`}
                        onClick={() => setRole('owner')}
                      >
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <i className="bi bi-building-add text-success fs-5"></i>
                          <span className="fw-bold text-dark small">Landlord / Host</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Post rental listings & manage inquiries
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-secondary">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="e.g. John Miller"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Username / User ID */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-secondary">
                      User ID / Username <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-at text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="e.g. john_miller"
                        required
                        pattern="^[a-zA-Z0-9_.-]{3,30}$"
                        title="3-30 letters, numbers, dot, dash, or underscore"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-secondary">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        placeholder="john@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-secondary">
                      Phone Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-telephone text-muted"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control border-start-0"
                        placeholder="+1 (555) 234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-secondary">
                      Password (min 6 chars) <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-start-0 border-end-0"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-light border border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-secondary">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-check2-circle text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-start-0"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Admin Passkey */}
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-muted p-0 text-decoration-none"
                    onClick={() => setRole(role === 'admin' ? 'renter' : 'admin')}
                  >
                    <i className="bi bi-shield-lock me-1"></i>
                    {role === 'admin' ? 'Switch back to standard account' : 'Are you a platform administrator? Click here'}
                  </button>
                  {role === 'admin' && (
                    <div className="mt-2 p-2 bg-light rounded-3 border">
                      <label className="form-label small fw-bold text-danger mb-1">
                        Admin Secret Passkey (Default: ADMIN2026)
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        placeholder="Enter Admin Passkey"
                        value={adminSecret}
                        onChange={(e) => setAdminSecret(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 fw-bold mt-4 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Saving account to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i>
                      <span>Save & Create Account</span>
                    </>
                  )}
                </button>
              </form>

              <hr className="my-4 text-muted opacity-25" />

              {/* Link to Login */}
              <div className="text-center small text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                  Sign In with User ID / Password
                </Link>
              </div>

              {/* Security Footnote */}
              <div className="mt-4 pt-2 text-center text-muted small border-top">
                <i className="bi bi-shield-lock-fill text-success me-1"></i>
                <span className="opacity-75">
                  Passwords are encrypted using bcrypt salt-hashing before MongoDB storage.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
