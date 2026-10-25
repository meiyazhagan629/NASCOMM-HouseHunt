import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ReviewModal = ({ propertyId, onClose, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post(`/properties/${propertyId}/reviews`, {
        rating,
        comment
      });
      if (onReviewAdded) onReviewAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

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
            <h5 className="modal-title font-heading fw-bold mb-0 text-dark">
              Write a Verified Review
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            {error && (
              <div className="alert alert-danger py-2 small mb-3">
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                {error}
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="mb-3 text-center py-2">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider d-block mb-2">
                Overall Experience Rating
              </label>
              <div className="d-flex justify-content-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="btn p-0 border-0 bg-transparent text-warning"
                    onClick={() => setRating(star)}
                    style={{ fontSize: '2rem' }}
                  >
                    <i className={`bi ${star <= rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                  </button>
                ))}
              </div>
              <div className="small text-muted mt-1">
                {rating === 5 && 'Outstanding - Exceptional property & host!'}
                {rating === 4 && 'Very Good - Met expectations with minor notes.'}
                {rating === 3 && 'Average - Decent accommodation.'}
                {rating <= 2 && 'Below Average - Had issues during experience.'}
              </div>
            </div>

            {/* Review Comment */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                Your Feedback & Experience
              </label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="What did you love about this property? How was the natural lighting, neighborhood safety, and landlord responsiveness?"
                value={comment}
                required
                maxLength={500}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div className="form-text text-end">{comment.length}/500</div>
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
                disabled={loading || !comment.trim()}
              >
                {loading ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
