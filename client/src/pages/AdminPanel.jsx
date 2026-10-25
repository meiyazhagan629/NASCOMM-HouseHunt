import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminPanel = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation', 'users', 'bookings'
  const [filterStatus, setFilterStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      const [statsRes, propsRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/properties'),
        api.get('/admin/users'),
        api.get('/admin/bookings')
      ]);

      setStats(statsRes.data.stats);
      setProperties(propsRes.data.properties || []);
      setUsers(usersRes.data.users || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [isAuthenticated, isAdmin]);

  // Admin approves or rejects property listing
  const handleUpdatePropertyStatus = async (propId, status) => {
    try {
      await api.put(`/properties/${propId}/status`, { status });
      setActionMsg(`Property listing marked as '${status}'`);
      setProperties(
        properties.map((p) => (p._id === propId ? { ...p, status } : p))
      );
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.stats);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update property status');
    }
  };

  // Admin toggles user account status
  const handleToggleUser = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      setActionMsg(res.data.message);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u))
      );
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const filteredProperties = properties.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger text-white">ADMIN SECURITY CLEARANCE</span>
            </div>
            <h2 className="fw-bold font-heading mb-0">Platform Moderation & Control Center</h2>
            <p className="text-muted small mb-0">
              Oversee property verification queues, review user activity, and monitor marketplace liquidity.
            </p>
          </div>
          <button onClick={fetchAdminData} className="btn btn-outline-custom btn-sm">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
          </button>
        </div>

        {actionMsg && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i> {actionMsg}
            <button type="button" className="btn-close" onClick={() => setActionMsg('')}></button>
          </div>
        )}

        {/* Analytics Metric Cards */}
        {stats && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <div className="card-custom p-3 bg-white border-start border-4 border-warning">
                <div className="text-muted small fw-semibold">Pending Moderation</div>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <span className="display-6 fw-bold font-heading text-warning">
                    {stats.properties?.pending || 0}
                  </span>
                  <span className="small text-muted">listings</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card-custom p-3 bg-white border-start border-4 border-success">
                <div className="text-muted small fw-semibold">Approved Listings</div>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <span className="display-6 fw-bold font-heading text-success">
                    {stats.properties?.approved || 0}
                  </span>
                  <span className="small text-muted">active</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card-custom p-3 bg-white border-start border-4 border-primary">
                <div className="text-muted small fw-semibold">Registered Users</div>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <span className="display-6 fw-bold font-heading text-primary">
                    {stats.users?.total || 0}
                  </span>
                  <span className="small text-muted">accounts</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card-custom p-3 bg-white border-start border-4 border-info">
                <div className="text-muted small fw-semibold">Total Rent Volume</div>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <span className="display-6 fw-bold font-heading text-info">
                    ${((stats.financials?.totalVolume || 0) / 1000).toFixed(1)}k
                  </span>
                  <span className="small text-muted">/ month</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="card-custom p-2 mb-4 bg-white">
          <ul className="nav nav-pills nav-pills-custom gap-2">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'moderation' ? 'active' : ''}`}
                onClick={() => setActiveTab('moderation')}
              >
                <i className="bi bi-shield-check me-2"></i>
                Property Moderation Queue ({properties.filter((p) => p.status === 'pending').length} pending)
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-people me-2"></i>
                User Management ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <i className="bi bi-journal-text me-2"></i>
                Platform Bookings ({bookings.length})
              </button>
            </li>
          </ul>
        </div>

        {/* TAB 1: PROPERTY MODERATION QUEUE */}
        {activeTab === 'moderation' && (
          <div className="card-custom p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold font-heading mb-0">Moderation Review List</h5>
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending Only ({properties.filter((p) => p.status === 'pending').length})
                </button>
                <button
                  className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterStatus('approved')}
                >
                  Approved
                </button>
                <button
                  className={`btn btn-sm ${filterStatus === 'rejected' ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterStatus('rejected')}
                >
                  Rejected
                </button>
                <button
                  className={`btn btn-sm ${filterStatus === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({properties.length})
                </button>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-check2-circle fs-1 text-success d-block mb-2"></i>
                <h6>No properties currently in the {filterStatus} queue.</h6>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Property</th>
                      <th>Host / Owner</th>
                      <th>Location</th>
                      <th>Rent</th>
                      <th>Status</th>
                      <th className="text-end">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=80'}
                              alt="thumbnail"
                              className="rounded-2"
                              style={{ width: '56px', height: '42px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-dark">{p.title}</div>
                              <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                                {p.propertyType} &bull; {p.bedrooms} Beds
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small fw-semibold">{p.owner?.name || 'Unknown Host'}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.owner?.email}</div>
                        </td>
                        <td>
                          <div className="small text-secondary">{p.location?.city}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>{p.location?.address}</div>
                        </td>
                        <td>
                          <strong className="text-primary">${p.price?.toLocaleString()}</strong>
                          <span className="text-muted small"> / mo</span>
                        </td>
                        <td>
                          {p.status === 'approved' && <span className="badge bg-success">Approved</span>}
                          {p.status === 'pending' && <span className="badge bg-warning text-dark">Pending</span>}
                          {p.status === 'rejected' && <span className="badge bg-danger">Rejected</span>}
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Link to={`/properties/${p._id}`} className="btn btn-sm btn-outline-secondary" title="View Full Page">
                              <i className="bi bi-eye"></i>
                            </Link>
                            {p.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdatePropertyStatus(p._id, 'approved')}
                                className="btn btn-sm btn-success text-white"
                                title="Approve Listing"
                              >
                                <i className="bi bi-check-lg me-1"></i> Approve
                              </button>
                            )}
                            {p.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdatePropertyStatus(p._id, 'rejected')}
                                className="btn btn-sm btn-outline-danger"
                                title="Reject Listing"
                              >
                                <i className="bi bi-x-lg me-1"></i> Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="card-custom p-4 bg-white">
            <h5 className="fw-bold font-heading mb-3">Registered Users Directory</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="text-end">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={u.name}
                            className="rounded-circle"
                            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                          />
                          <span className="fw-bold">{u.name}</span>
                        </div>
                      </td>
                      <td className="small text-secondary">{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'owner' ? 'bg-primary' : 'bg-success'}`}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="small text-secondary">{u.phone || 'N/A'}</td>
                      <td>
                        <span className={`badge ${u.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="text-end">
                        {u._id !== user._id && (
                          <button
                            onClick={() => handleToggleUser(u._id)}
                            className={`btn btn-sm ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ALL BOOKINGS AUDIT */}
        {activeTab === 'bookings' && (
          <div className="card-custom p-4 bg-white">
            <h5 className="fw-bold font-heading mb-3">Platform-Wide Rental Appointments & Bookings</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Property</th>
                    <th>Renter (Tenant)</th>
                    <th>Host (Owner)</th>
                    <th>Visit Date</th>
                    <th>Rent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-bold text-dark small">{b.property?.title || 'Unknown Property'}</td>
                      <td>
                        <div className="small fw-semibold">{b.renter?.name || 'Renter'}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.renter?.email}</div>
                      </td>
                      <td>
                        <div className="small fw-semibold">{b.owner?.name || 'Owner'}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.owner?.email}</div>
                      </td>
                      <td className="small text-secondary">
                        {new Date(b.visitDate).toLocaleDateString()} at {b.preferredTime}
                      </td>
                      <td className="fw-semibold text-primary small">
                        ${b.property?.price?.toLocaleString()}/mo
                      </td>
                      <td>
                        {b.status === 'confirmed' && <span className="badge bg-success">Confirmed</span>}
                        {b.status === 'pending' && <span className="badge bg-warning text-dark">Pending</span>}
                        {b.status === 'rejected' && <span className="badge bg-danger">Declined</span>}
                        {b.status === 'cancelled' && <span className="badge bg-secondary">Cancelled</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
