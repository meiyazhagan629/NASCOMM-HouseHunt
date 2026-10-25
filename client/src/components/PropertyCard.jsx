import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onOpenVirtualTour }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const handlePrevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="card-custom h-100 d-flex flex-column position-relative">
      {/* Property Image Container */}
      <div className="position-relative" style={{ height: '220px', overflow: 'hidden' }}>
        <img
          src={images[imgIndex]}
          alt={property.title}
          className="w-100 h-100"
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
        />

        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center shadow-sm p-0"
          style={{ width: '36px', height: '36px', zIndex: 2 }}
          title={isFavorite ? 'Remove from saved' : 'Save to favorites'}
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart text-secondary'}`}></i>
        </button>

        {/* Type & Verified Badges */}
        <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1" style={{ zIndex: 2 }}>
          <span className="badge badge-type shadow-sm">
            {property.propertyType}
          </span>
          {property.featured && (
            <span className="badge bg-warning text-dark shadow-sm">
              <i className="bi bi-star-fill me-1"></i> Featured
            </span>
          )}
        </div>

        {/* Virtual Tour Floating Indicator */}
        {property.virtualTourUrl && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenVirtualTour) onOpenVirtualTour(property);
            }}
            className="btn btn-dark btn-sm rounded-pill position-absolute bottom-0 start-0 m-3 shadow-sm py-1 px-3 d-flex align-items-center gap-1 opacity-90"
            style={{ fontSize: '0.75rem', zIndex: 2 }}
          >
            <i className="bi bi-camera-video-fill text-info"></i>
            <span>360° Virtual Tour</span>
          </button>
        )}

        {/* Multiple Image Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="btn btn-dark bg-opacity-50 text-white rounded-circle position-absolute start-0 top-50 translate-middle-y ms-2 p-0 d-flex align-items-center justify-content-center"
              style={{ width: '28px', height: '28px', zIndex: 2 }}
            >
              <i className="bi bi-chevron-left" style={{ fontSize: '0.75rem' }}></i>
            </button>
            <button
              onClick={handleNextImg}
              className="btn btn-dark bg-opacity-50 text-white rounded-circle position-absolute end-0 top-50 translate-middle-y me-2 p-0 d-flex align-items-center justify-content-center"
              style={{ width: '28px', height: '28px', zIndex: 2 }}
            >
              <i className="bi bi-chevron-right" style={{ fontSize: '0.75rem' }}></i>
            </button>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Price & Rating Row */}
        <div className="d-flex justify-content-between align-items-baseline mb-2">
          <div>
            <span className="fs-4 fw-bold font-heading text-primary">
              ${property.price?.toLocaleString()}
            </span>
            <span className="text-muted small"> / month</span>
          </div>
          <div className="d-flex align-items-center gap-1 small fw-semibold text-dark">
            <i className="bi bi-star-fill text-warning"></i>
            <span>{property.rating ? property.rating.toFixed(1) : '4.8'}</span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              ({property.reviewsCount || 8})
            </span>
          </div>
        </div>

        {/* Property Title */}
        <h5 className="card-title text-truncate fw-bold mb-1" title={property.title}>
          <Link to={`/properties/${property._id}`} className="text-dark hover-primary text-decoration-none">
            {property.title}
          </Link>
        </h5>

        {/* Location Address */}
        <p className="text-muted small mb-3 text-truncate">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
          {property.location?.address}, {property.location?.city}
        </p>

        {/* Specifications Icons */}
        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle small text-secondary mt-auto mb-3">
          <div className="d-flex align-items-center gap-1" title="Bedrooms">
            <i className="bi bi-door-open fs-6 text-primary"></i>
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="d-flex align-items-center gap-1" title="Bathrooms">
            <i className="bi bi-droplet fs-6 text-info"></i>
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="d-flex align-items-center gap-1" title="Living Area">
            <i className="bi bi-aspect-ratio fs-6 text-success"></i>
            <span>{property.areaSqFt} sq ft</span>
          </div>
        </div>

        {/* View Details CTA */}
        <Link
          to={`/properties/${property._id}`}
          className="btn btn-light border w-100 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 hover-primary rounded-3"
        >
          <span>View Property Details</span>
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
