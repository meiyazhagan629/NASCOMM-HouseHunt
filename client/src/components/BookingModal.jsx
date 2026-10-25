import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookingModal = ({ property, onClose, onBookingSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [bookingType, setBookingType] = useState('Visit');
  const [visitDate, setVisitDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [durationMonths, setDurationMonths] = useState(12);
  const [tenantNotes, setTenantNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/bookings', {
        propertyId: property._id,
        bookingType,
        visitDate,
        preferredTime,
        durationMonths: Number(durationMonths),
        tenantNotes
      });

      setSuccess(true);
      if (onBookingSuccess) onBookingSuccess(res.data.booking);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit booking request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ];

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1055 }}
      tabIndex="-1"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-2xl">
          <div className="modal-header border-bottom py-3 px-4 bg-light d-flex justify-content-between align-items-center">
            <div>
              <h5 className="modal-title font-heading fw-bold mb-0 text-dark">
                {bookingType === 'Visit' ? 'Schedule an In-Person Visit' : 'Reserve & Rent Property'}
              </h5>
              <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '350px' }}>
                {property.title}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            {success ? (
              <div className="text-center py-4">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="bi bi-check-lg fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark font-heading">Booking Request Sent!</h4>
                <p className="text-secondary small mb-4">
                  The landlord has received your schedule request for <strong>{visitDate} at {preferredTime}</strong>. You will receive updates in your dashboard.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/dashboard');
                    }}
                    className="btn btn-primary-custom px-4"
                  >
                    View in Dashboard
                  </button>
                  <button onClick={onClose} className="btn btn-outline-secondary px-3">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger py-2 small mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    {error}
                  </div>
                )}

                {/* Booking Type Switcher */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                    I want to:
                  </label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${bookingType === 'Visit' ? 'btn-primary' : 'btn-outline-secondary'} py-2 fw-semibold`}
                      onClick={() => setBookingType('Visit')}
                    >
                      <i className="bi bi-calendar-check me-2"></i> Schedule Visit
                    </button>
                    <button
                      type="button"
                      className={`btn ${bookingType === 'Rent' ? 'btn-primary' : 'btn-outline-secondary'} py-2 fw-semibold`}
                      onClick={() => setBookingType('Rent')}
                    >
                      <i className="bi bi-key-fill me-2"></i> Apply to Rent
                    </button>
                  </div>
                </div>

                {/* Visit / Move-in Date */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                      {bookingType === 'Visit' ? 'Preferred Date' : 'Target Move-In Date'}
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={visitDate}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      onChange={(e) => setVisitDate(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                      Preferred Time Slot
                    </label>
                    <select
                      className="form-select"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Lease Duration if Renting */}
                {bookingType === 'Rent' && (
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                      Desired Lease Term
                    </label>
                    <select
                      className="form-select"
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(e.target.value)}
                    >
                      <option value="6">6 Months Lease</option>
                      <option value="12">12 Months (Standard Annual Lease)</option>
                      <option value="24">24 Months (Long Term)</option>
                    </select>
                  </div>
                )}

                {/* Tenant Inquiry Notes */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                    Message or Notes for Landlord
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Tell the landlord about your relocation timeframe, questions about utilities, parking, or pets..."
                    value={tenantNotes}
                    onChange={(e) => setTenantNotes(e.target.value)}
                  ></textarea>
                </div>

                {/* Financial Summary Card */}
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Monthly Rent:</span>
                    <span className="fw-semibold text-dark">${property.price?.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Security Deposit (refundable):</span>
                    <span className="fw-semibold text-dark">
                      ${(property.securityDeposit || property.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold pt-2 border-top text-primary">
                    <span>Estimated Move-In Total:</span>
                    <span>
                      ${(property.price + (property.securityDeposit || property.price)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Confirm & Submit Request'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
