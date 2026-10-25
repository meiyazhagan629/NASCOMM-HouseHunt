import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VirtualTourModal from '../components/VirtualTourModal';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';
import api from '../services/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  // Modals
  const [showTourModal, setShowTourModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data.property);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError('Could not load property details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading property...</span>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning max-w-md mx-auto">
          <h4>Property Not Found</h4>
          <p className="mb-3">This listing may have been rented or removed.</p>
          <Link to="/properties" className="btn btn-primary-custom">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const amenityIcons = {
    'WiFi': 'bi-wifi',
    'Swimming Pool': 'bi-water',
    'Gym': 'bi-activity',
    'Parking': 'bi-car-front-fill',
    'Air Conditioning': 'bi-wind',
    'Pet Friendly': 'bi-heart-fill',
    'Balcony': 'bi-sun-fill',
    'Elevator': 'bi-arrow-up-circle',
    'Security / CCTV': 'bi-shield-check',
    'Power Backup': 'bi-lightning-charge-fill'
  };

  return (
    <div className="py-4 bg-light">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/properties">Properties</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{property.title}</li>
          </ol>
        </nav>

        {/* Title & Price Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge badge-type">{property.propertyType}</span>
              <span className="badge badge-verified">
                <i className="bi bi-shield-check me-1"></i> Verified Listing
              </span>
              <span className="badge bg-secondary text-white">{property.furnishing}</span>
            </div>
            <h1 className="fw-bold font-heading mb-1 display-6">{property.title}</h1>
            <p className="text-muted mb-0">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.pincode}
            </p>
          </div>

          <div className="text-md-end">
            <div className="display-6 fw-bold font-heading text-primary">
              ${property.price?.toLocaleString()}
              <span className="fs-6 text-muted fw-normal"> / month</span>
            </div>
            <div className="small text-muted">
              Security Deposit: ${(property.securityDeposit || property.price).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Photo Gallery & Thumbnail Selector */}
        <div className="card-custom mb-4 p-3">
          <div className="row g-3">
            <div className="col-lg-9 position-relative">
              <img
                src={images[selectedImgIndex]}
                alt={property.title}
                className="gallery-main shadow-sm"
              />
              {property.virtualTourUrl && (
                <button
                  onClick={() => setShowTourModal(true)}
                  className="btn btn-dark position-absolute bottom-0 start-0 m-4 py-2 px-3 rounded-pill shadow d-flex align-items-center gap-2 opacity-95"
                >
                  <i className="bi bi-camera-video-fill text-info fs-5"></i>
                  <span className="fw-semibold">Launch 360° Virtual Tour</span>
                </button>
              )}
            </div>

            <div className="col-lg-3">
              <div className="d-flex flex-row flex-lg-column gap-2" style={{ maxHeight: '440px', overflowY: 'auto' }}>
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`gallery-thumb ${selectedImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImgIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Details & Booking Action Sidebar */}
        <div className="row g-4">
          {/* Main Info Column */}
          <div className="col-lg-8">
            {/* Highlights Grid */}
            <div className="card-custom p-4 mb-4">
              <h5 className="fw-bold font-heading mb-3">Key Highlights</h5>
              <div className="row g-3 text-center">
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <i className="bi bi-door-open fs-3 text-primary mb-1 d-block"></i>
                    <span className="small text-muted d-block">Bedrooms</span>
                    <strong className="fs-5 font-heading text-dark">{property.bedrooms} BHK</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <i className="bi bi-droplet fs-3 text-info mb-1 d-block"></i>
                    <span className="small text-muted d-block">Bathrooms</span>
                    <strong className="fs-5 font-heading text-dark">{property.bathrooms} Baths</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <i className="bi bi-aspect-ratio fs-3 text-success mb-1 d-block"></i>
                    <span className="small text-muted d-block">Super Area</span>
                    <strong className="fs-5 font-heading text-dark">{property.areaSqFt} sq ft</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <i className="bi bi-calendar-check fs-3 text-warning mb-1 d-block"></i>
                    <span className="small text-muted d-block">Availability</span>
                    <strong className="fs-5 font-heading text-capitalize text-dark">{property.availability}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-custom p-4 mb-4">
              <h5 className="fw-bold font-heading mb-3">About This Property</h5>
              <p className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="card-custom p-4 mb-4">
              <h5 className="fw-bold font-heading mb-3">Features & Amenities</h5>
              <div className="row g-3">
                {property.amenities && property.amenities.map((amenity) => (
                  <div className="col-6 col-md-4" key={amenity}>
                    <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-light border">
                      <i className={`bi ${amenityIcons[amenity] || 'bi-check-circle-fill'} text-primary fs-5`}></i>
                      <span className="small fw-semibold text-secondary">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card-custom p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold font-heading mb-0">Tenant Reviews & Ratings</h5>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <div className="d-flex text-warning">
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <strong className="text-dark">{property.rating || '4.8'} out of 5</strong>
                    <span className="text-muted small">({reviews.length} verified ratings)</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else setShowReviewModal(true);
                  }}
                  className="btn btn-outline-custom btn-sm"
                >
                  <i className="bi bi-pencil-square me-1"></i> Write Review
                </button>
              </div>

              <hr className="my-3 text-muted opacity-25" />

              {reviews.length === 0 ? (
                <p className="text-muted small text-center py-3">
                  No written reviews yet. Be the first to share your experience with this property!
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                            alt={rev.user?.name}
                            className="rounded-circle"
                            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-dark small">{rev.user?.name || 'Verified Renter'}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex text-warning small">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-secondary small mb-0">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking & Host Sidebar */}
          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: '100px' }}>
              {/* Host Profile Card */}
              <div className="card-custom p-4 mb-4">
                <span className="badge bg-primary-subtle text-primary fw-bold mb-2">PROPERTY HOST</span>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img
                    src={property.owner?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'}
                    alt={property.owner?.name}
                    className="rounded-circle shadow-sm"
                    style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0 font-heading text-dark">{property.owner?.name || 'Marcus Sterling'}</h6>
                    <div className="small text-muted">Direct Property Host</div>
                    <div className="d-flex align-items-center gap-1 text-success small">
                      <i className="bi bi-patch-check-fill"></i>
                      <span style={{ fontSize: '0.75rem' }}>Identity Verified</span>
                    </div>
                  </div>
                </div>

                <div className="border-top pt-3 small text-secondary d-flex flex-column gap-2 mb-4">
                  <div className="d-flex justify-content-between">
                    <span>Phone:</span>
                    <strong className="text-dark">{property.owner?.phone || '+1 (555) 019-2834'}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Email:</span>
                    <strong className="text-dark">{property.owner?.email || 'owner@househunt.com'}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Response Time:</span>
                    <span className="text-success fw-semibold">Under 1 hour</span>
                  </div>
                </div>

                {/* Primary Booking CTA */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else setShowBookingModal(true);
                  }}
                  className="btn btn-primary-custom w-100 py-3 fw-bold mb-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-calendar-check-fill"></i>
                  <span>Schedule Visit / Book Now</span>
                </button>

                {property.virtualTourUrl && (
                  <button
                    onClick={() => setShowTourModal(true)}
                    className="btn btn-outline-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-camera-video text-primary"></i>
                    <span>Take 360° Virtual Tour</span>
                  </button>
                )}
              </div>

              {/* Safety & Assurance Card */}
              <div className="p-3 bg-white rounded-3 border text-center small text-muted">
                <i className="bi bi-shield-lock-fill text-success fs-4 d-block mb-1"></i>
                <div className="fw-bold text-dark mb-1">HouseHunt Tenant Guarantee</div>
                <div>Zero hidden charges. Rent and deposit agreements protected by standardized digital leases.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTourModal && (
        <VirtualTourModal
          property={property}
          onClose={() => setShowTourModal(false)}
        />
      )}

      {showBookingModal && (
        <BookingModal
          property={property}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => fetchProperty()}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          propertyId={property._id}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={(data) => {
            setReviews([data.review, ...reviews]);
            setProperty({
              ...property,
              rating: data.newRating,
              reviewsCount: data.reviewsCount
            });
          }}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
