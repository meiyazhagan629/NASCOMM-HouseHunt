import React from 'react';

const VirtualTourModal = ({ property, onClose }) => {
  if (!property) return null;

  const tourUrl =
    property.virtualTourUrl || 'https://my.matterport.com/show/?m=JGPnGQ6hosj';

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 1055 }}
      tabIndex="-1"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-2xl bg-dark text-white">
          <div className="modal-header border-secondary border-opacity-25 py-3 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary px-3 py-2 rounded-pill">
                <i className="bi bi-camera-video me-1"></i> Interactive 360° Walkthrough
              </span>
              <h5 className="modal-title font-heading text-white fw-bold mb-0 text-truncate" style={{ maxWidth: '400px' }}>
                {property.title}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-0 position-relative" style={{ minHeight: '520px' }}>
            <iframe
              src={tourUrl}
              title={`Virtual Tour - ${property.title}`}
              className="virtual-tour-frame w-100"
              style={{ minHeight: '550px', border: 'none' }}
              allowFullScreen
              allow="xr-spatial-tracking; accelerometer; gyroscope"
            ></iframe>
          </div>

          <div className="modal-footer border-secondary border-opacity-25 py-2 px-4 justify-content-between">
            <div className="small text-secondary">
              <i className="bi bi-geo-alt me-1 text-danger"></i>
              {property.location?.address}, {property.location?.city} &bull; ${property.price?.toLocaleString()}/month
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-light rounded-pill px-3"
              onClick={onClose}
            >
              Close Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourModal;
