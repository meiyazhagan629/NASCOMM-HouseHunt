import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PostProperty = () => {
  const { isAuthenticated, user, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    listingType: 'Rent',
    address: '',
    city: 'San Francisco',
    state: 'CA',
    pincode: '94103',
    landmark: '',
    price: 3200,
    securityDeposit: 3200,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1150,
    furnishing: 'Furnished',
    amenities: ['WiFi', 'Parking', 'Air Conditioning', 'Gym'],
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const samplePhotoPresets = [
    { label: 'Modern Living Room', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Luxury Villa Exterior', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Urban Loft Interior', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Scenic Penthouse Deck', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' }
  ];

  const amenityOptions = [
    'WiFi',
    'Swimming Pool',
    'Gym',
    'Parking',
    'Air Conditioning',
    'Pet Friendly',
    'Balcony',
    'Elevator',
    'Security / CCTV',
    'Power Backup'
  ];

  const handleAmenityToggle = (amenity) => {
    const exists = formData.amenities.includes(amenity);
    if (exists) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark
        },
        price: Number(formData.price),
        securityDeposit: Number(formData.securityDeposit),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.areaSqFt),
        furnishing: formData.furnishing,
        amenities: formData.amenities,
        images: [formData.imageUrl],
        virtualTourUrl: formData.virtualTourUrl
      };

      const res = await api.post('/properties', payload);
      setSuccessMsg(res.data.message);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit property listing. Please verify all inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container">
        <div className="max-w-xl mx-auto mb-4">
          <h2 className="fw-bold font-heading mb-1">List Your Rental Property</h2>
          <p className="text-muted small mb-0">
            Publish your property on HouseHunt and connect with thousands of verified tenants.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4 max-w-xl mx-auto">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success mb-4 max-w-xl mx-auto">
            <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
          </div>
        )}

        <div className="row g-4 justify-content-center">
          {/* Main Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="card-custom p-4">
              {/* Section 1: Basic Information */}
              <h5 className="fw-bold font-heading mb-3 text-primary d-flex align-items-center gap-2">
                <i className="bi bi-info-circle"></i>
                <span>1. Basic Property Details</span>
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Property Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Spacious 2-BHK Highrise Apartment with Bay View"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Property Type</label>
                  <select
                    className="form-select"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Listing Intent</label>
                  <select
                    className="form-select"
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  >
                    <option value="Rent">For Rent</option>
                    <option value="Sale">For Sale</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe your property, proximity to public transit, neighborhood, natural sunlight, kitchen appliances..."
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Section 2: Location Information */}
              <h5 className="fw-bold font-heading mb-3 text-primary d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt"></i>
                <span>2. Location & Address</span>
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Street Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 845 Market Street, Flat 4B"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. San Francisco"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. CA"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">Pincode / ZIP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 94103"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 3: Pricing & Specs */}
              <h5 className="fw-bold font-heading mb-3 text-primary d-flex align-items-center gap-2">
                <i className="bi bi-cash-stack"></i>
                <span>3. Financials & Layout Specifications</span>
              </h5>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Monthly Rent ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    min="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Security Deposit ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">Bedrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="10"
                    required
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">Bathrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="10"
                    required
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">Area (Sq Ft)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="100"
                    required
                    value={formData.areaSqFt}
                    onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">Furnishing</label>
                  <select
                    className="form-select"
                    value={formData.furnishing}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Section 4: Amenities */}
              <h5 className="fw-bold font-heading mb-3 text-primary d-flex align-items-center gap-2">
                <i className="bi bi-stars"></i>
                <span>4. Select Amenities</span>
              </h5>

              <div className="row g-2 mb-4">
                {amenityOptions.map((amenity) => (
                  <div className="col-6 col-md-4" key={amenity}>
                    <div className="form-check p-2 rounded bg-light border">
                      <input
                        className="form-check-input ms-0 me-2"
                        type="checkbox"
                        id={`post-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <label className="form-check-label small text-dark cursor-pointer" htmlFor={`post-${amenity}`}>
                        {amenity}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 5: Media & Virtual Tour */}
              <h5 className="fw-bold font-heading mb-3 text-primary d-flex align-items-center gap-2">
                <i className="bi bi-camera-video"></i>
                <span>5. Images & 360 Virtual Tour</span>
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Property Photo URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span className="small text-muted align-self-center">Or pick demo photo:</span>
                  {samplePhotoPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="btn btn-sm btn-outline-secondary py-0 px-2 small"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">
                  360° Virtual Tour URL (Matterport / Walkthrough)
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://my.matterport.com/show/?m=..."
                  value={formData.virtualTourUrl}
                  onChange={(e) => setFormData({ ...formData, virtualTourUrl: e.target.value })}
                />
              </div>

              <hr className="my-4" />

              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-5 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Submitting Property...' : 'Submit Property Listing'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Sidebar */}
          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: '100px' }}>
              <div className="card-custom p-3 bg-white shadow-sm mb-3">
                <span className="badge bg-secondary mb-2">LIVE CARD PREVIEW</span>
                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '12px' }}>
                  <img
                    src={formData.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="pt-3">
                  <div className="fs-5 fw-bold text-primary font-heading">
                    ${Number(formData.price || 0).toLocaleString()} <span className="small text-muted fw-normal">/ mo</span>
                  </div>
                  <h6 className="fw-bold text-dark text-truncate mt-1">
                    {formData.title || 'Your Property Title'}
                  </h6>
                  <p className="text-muted small text-truncate mb-2">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    {formData.address || '123 Main St'}, {formData.city}
                  </p>
                  <div className="d-flex justify-content-between text-secondary small pt-2 border-top">
                    <span>{formData.bedrooms} Beds</span>
                    <span>{formData.bathrooms} Baths</span>
                    <span>{formData.areaSqFt} sq ft</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border small text-muted">
                <i className="bi bi-info-circle-fill text-primary me-1"></i>
                {isAdmin
                  ? 'As an Administrator, your submitted property listing will be approved instantly.'
                  : 'As a Landlord / Property Owner, your listing will be reviewed by administrators before going live.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProperty;
