import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'properties', 'requests', 'profile'
  const [myBookings, setMyBookings] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
      setProfileAvatar(user.avatar || '');
    }

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch renter's bookings
        const bookingsRes = await api.get('/bookings/my-bookings');
        setMyBookings(bookingsRes.data.bookings || []);

        // If user is owner or admin, fetch listings and received requests
        if (user?.role === 'owner' || user?.role === 'admin') {
          const [propsRes, reqsRes] = await Promise.all([
            api.get('/properties/my-listings'),
            api.get('/bookings/owner-requests')
          ]);
          setMyProperties(propsRes.data.properties || []);
          setOwnerRequests(reqsRes.data.bookings || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, user]);

  // Cancel booking (Renter)
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled visit?')) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setMyBookings(
        myBookings.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling booking');
    }
  };

  // Landlord responds to booking
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setOwnerRequests(
        ownerRequests.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating booking');
    }
  };

  // Delete property (Landlord)
  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Delete this property listing permanently?')) return;
    try {
      await api.delete(`/properties/${propId}`);
      setMyProperties(myProperties.filter((p) => p._id !== propId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting property');
    }
  };

  // Update profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', {
        name: profileName,
        phone: profilePhone,
        avatar: profileAvatar
      });
      updateProfile(res.data.user);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving profile');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
        return <span className="badge bg-success text-white">Confirmed / Approved</span>;
      case 'pending':
        return <span className="badge bg-warning text-dark">Pending Review</span>;
      case 'rejected':
        return <span className="badge bg-danger text-white">Declined / Rejected</span>;
      case 'cancelled':
        return <span className="badge bg-secondary text-white">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container">
        {/* User Greeting Card */}
        <div className="card-custom p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt={user?.name}
                className="rounded-circle shadow"
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
              />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-bold font-heading mb-0">{user?.name}</h3>
                  <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : user?.role === 'owner' ? 'bg-primary' : 'bg-success'}`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
                <div className="text-muted small">
                  <i className="bi bi-envelope me-1"></i> {user?.email} &bull; <i className="bi bi-telephone ms-2 me-1"></i> {user?.phone || 'No phone set'}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link to="/post-property" className="btn btn-primary-custom">
                <i className="bi bi-plus-circle me-1"></i> Post New Property
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Content Row */}
        <div className="row g-4">
          {/* Navigation Sidebar */}
          <div className="col-lg-3">
            <div className="card-custom p-3">
              <div className="d-flex flex-column gap-1">
                <div
                  className={`dashboard-menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <i className="bi bi-calendar2-check fs-5"></i>
                  <span>My Scheduled Visits</span>
                  <span className="badge bg-light text-dark ms-auto border">{myBookings.length}</span>
                </div>

                {(user?.role === 'owner' || user?.role === 'admin') && (
                  <>
                    <div
                      className={`dashboard-menu-item ${activeTab === 'properties' ? 'active' : ''}`}
                      onClick={() => setActiveTab('properties')}
                    >
                      <i className="bi bi-houses fs-5"></i>
                      <span>My Property Listings</span>
                      <span className="badge bg-light text-dark ms-auto border">{myProperties.length}</span>
                    </div>

                    <div
                      className={`dashboard-menu-item ${activeTab === 'requests' ? 'active' : ''}`}
                      onClick={() => setActiveTab('requests')}
                    >
                      <i className="bi bi-inbox fs-5"></i>
                      <span>Received Inquiries</span>
                      <span className="badge bg-danger text-white ms-auto">
                        {ownerRequests.filter((r) => r.status === 'pending').length}
                      </span>
                    </div>
                  </>
                )}

                <div
                  className={`dashboard-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person-gear fs-5"></i>
                  <span>Profile Settings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="col-lg-9">
            {/* Tab 1: My Bookings (Renter) */}
            {activeTab === 'bookings' && (
              <div className="card-custom p-4">
                <h5 className="fw-bold font-heading mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-calendar2-check text-primary"></i>
                  <span>My Scheduled Visits & Rental Requests</span>
                </h5>

                {myBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-x fs-1 text-muted d-block mb-2"></i>
                    <h6 className="fw-bold">No Scheduled Visits Yet</h6>
                    <p className="text-muted small mb-3">Browse available houses and schedule an in-person or virtual walkthrough.</p>
                    <Link to="/properties" className="btn btn-primary-custom btn-sm">Explore Properties</Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {myBookings.map((b) => (
                      <div key={b._id} className="p-3 bg-light rounded-3 border">
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                          <div className="d-flex gap-3">
                            <img
                              src={b.property?.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                              alt="Property"
                              className="rounded-3"
                              style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="fw-bold mb-1">
                                <Link to={`/properties/${b.property?._id}`} className="text-dark hover-primary text-decoration-none">
                                  {b.property?.title || 'Property Listing'}
                                </Link>
                              </h6>
                              <div className="small text-muted mb-1">
                                <i className="bi bi-geo-alt me-1"></i> {b.property?.location?.address}, {b.property?.location?.city}
                              </div>
                              <div className="small text-secondary">
                                <span className="fw-semibold">Visit Date:</span> {new Date(b.visitDate).toLocaleDateString()} at {b.preferredTime} &bull; <span className="fw-semibold">Rent:</span> ${b.monthlyRent?.toLocaleString()}/mo
                              </div>
                            </div>
                          </div>

                          <div className="d-flex flex-column align-items-md-end justify-content-between gap-2">
                            <div>{getStatusBadge(b.status)}</div>
                            {b.status === 'pending' && (
                              <button
                                onClick={() => handleCancelBooking(b._id)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                Cancel Request
                              </button>
                            )}
                          </div>
                        </div>

                        {b.ownerResponse && (
                          <div className="mt-2 pt-2 border-top small text-success">
                            <i className="bi bi-chat-quote-fill me-1"></i> <strong>Host Note:</strong> {b.ownerResponse}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: My Properties (Landlord) */}
            {activeTab === 'properties' && (
              <div className="card-custom p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold font-heading mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-houses text-primary"></i>
                    <span>My Property Listings</span>
                  </h5>
                  <Link to="/post-property" className="btn btn-primary-custom btn-sm">
                    <i className="bi bi-plus-lg me-1"></i> Add Property
                  </Link>
                </div>

                {myProperties.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-house-add fs-1 text-muted d-block mb-2"></i>
                    <h6 className="fw-bold">You Haven't Listed Any Properties Yet</h6>
                    <p className="text-muted small mb-3">Reach verified tenants by publishing your apartment, villa, or studio.</p>
                    <Link to="/post-property" className="btn btn-primary-custom btn-sm">Post First Listing</Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {myProperties.map((p) => (
                      <div key={p._id} className="p-3 bg-light rounded-3 border d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex gap-3 align-items-center">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                            alt={p.title}
                            className="rounded-3"
                            style={{ width: '90px', height: '70px', objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="fw-bold mb-1">
                              <Link to={`/properties/${p._id}`} className="text-dark hover-primary text-decoration-none">
                                {p.title}
                              </Link>
                            </h6>
                            <div className="small text-muted mb-1">
                              {p.location?.city} &bull; ${p.price?.toLocaleString()}/month &bull; {p.bedrooms} BHK
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              {getStatusBadge(p.status)}
                              <span className="badge bg-light text-dark border">{p.availability}</span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <Link to={`/properties/${p._id}`} className="btn btn-outline-secondary btn-sm">
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteProperty(p._id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Received Booking Requests (Landlord) */}
            {activeTab === 'requests' && (
              <div className="card-custom p-4">
                <h5 className="fw-bold font-heading mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-inbox text-primary"></i>
                  <span>Tenant Visit & Rental Inquiries</span>
                </h5>

                {ownerRequests.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-envelope-open fs-1 text-muted d-block mb-2"></i>
                    <h6 className="fw-bold">No Inquiries Received Yet</h6>
                    <p className="text-muted small">When renters schedule a visit or apply for your property, requests appear here.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {ownerRequests.map((req) => (
                      <div key={req._id} className="p-3 bg-light rounded-3 border">
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-2">
                          <div className="d-flex gap-3">
                            <img
                              src={req.renter?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                              alt={req.renter?.name}
                              className="rounded-circle"
                              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="fw-bold mb-0 text-dark">{req.renter?.name}</h6>
                              <div className="small text-muted mb-1">
                                <i className="bi bi-envelope me-1"></i> {req.renter?.email} &bull; <i className="bi bi-telephone ms-1 me-1"></i> {req.renter?.phone}
                              </div>
                              <div className="small fw-semibold text-primary">
                                Property: {req.property?.title}
                              </div>
                            </div>
                          </div>

                          <div className="text-md-end">
                            {getStatusBadge(req.status)}
                            <div className="small text-muted mt-1">
                              Visit: <strong>{new Date(req.visitDate).toLocaleDateString()}</strong> at <strong>{req.preferredTime}</strong>
                            </div>
                          </div>
                        </div>

                        {req.tenantNotes && (
                          <div className="bg-white p-2 rounded border small text-secondary mb-3">
                            <i className="bi bi-quote me-1 text-muted"></i> {req.tenantNotes}
                          </div>
                        )}

                        {req.status === 'pending' && (
                          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button
                              onClick={() => handleUpdateBookingStatus(req._id, 'rejected')}
                              className="btn btn-outline-danger btn-sm px-3"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(req._id, 'confirmed')}
                              className="btn btn-success btn-sm px-3 text-white"
                            >
                              Confirm Visit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Profile Settings */}
            {activeTab === 'profile' && (
              <div className="card-custom p-4">
                <h5 className="fw-bold font-heading mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-person-gear text-primary"></i>
                  <span>Profile & Contact Preferences</span>
                </h5>

                {profileMsg && (
                  <div className="alert alert-success py-2 small mb-3">
                    <i className="bi bi-check-circle-fill me-1"></i> {profileMsg}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="max-w-md">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileName}
                      required
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Email (Read Only)</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={profilePhone}
                      placeholder="+1 (555) 000-0000"
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">Avatar Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary-custom px-4">
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
