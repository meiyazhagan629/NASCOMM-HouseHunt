import React from 'react';

const PropertyFilter = ({ filters, setFilters, onReset }) => {
  const cities = ['All', 'New York', 'San Francisco', 'Chicago', 'Austin', 'Miami', 'Seattle'];
  const propertyTypes = ['All', 'Apartment', 'Independent House', 'Villa', 'Studio', 'Penthouse'];
  const furnishingOptions = ['All', 'Furnished', 'Semi-Furnished', 'Unfurnished'];
  const bedroomOptions = [
    { label: 'Any Beds', value: 'All' },
    { label: '1 Bed', value: '1' },
    { label: '2 Beds', value: '2' },
    { label: '3 Beds', value: '3' },
    { label: '4+ Beds', value: '4' }
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
    const current = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    let updated;
    if (current.includes(amenity)) {
      updated = current.filter((a) => a !== amenity);
    } else {
      updated = [...current, amenity];
    }
    setFilters({ ...filters, amenities: updated.join(',') });
  };

  const selectedAmenities = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];

  return (
    <div className="card-custom p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold font-heading mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-funnel-fill text-primary"></i>
          <span>Filter Properties</span>
        </h5>
        <button
          onClick={onReset}
          className="btn btn-sm btn-link text-decoration-none text-muted p-0"
        >
          Reset All
        </button>
      </div>

      <hr className="my-3 text-muted opacity-25" />

      {/* Keyword Search */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
          Search Keyword
        </label>
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control bg-light border-start-0 ps-0"
            placeholder="Title, landmark, address..."
            value={filters.keyword || ''}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
        </div>
      </div>

      {/* City Filter */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
          Target City
        </label>
        <select
          className="form-select bg-light"
          value={filters.city || 'All'}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All Cities' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
          Property Type
        </label>
        <select
          className="form-select bg-light"
          value={filters.propertyType || 'All'}
          onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
        >
          {propertyTypes.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Types' : t}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms Toggle */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
          Bedrooms
        </label>
        <div className="d-flex flex-wrap gap-1">
          {bedroomOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters({ ...filters, bedrooms: opt.value })}
              className={`btn btn-sm rounded-pill ${
                (filters.bedrooms || 'All') === opt.value
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              } px-3 py-1`}
              style={{ fontSize: '0.8rem' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-0">
            Max Monthly Rent
          </label>
          <span className="badge bg-light text-dark border fw-bold">
            ${Number(filters.maxPrice || 10000).toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          className="form-range"
          min="1000"
          max="10000"
          step="250"
          value={filters.maxPrice || 10000}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
          <span>$1,000</span>
          <span>$5,000</span>
          <span>$10,000+</span>
        </div>
      </div>

      {/* Furnishing */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
          Furnishing Status
        </label>
        <select
          className="form-select bg-light"
          value={filters.furnishing || 'All'}
          onChange={(e) => setFilters({ ...filters, furnishing: e.target.value })}
        >
          {furnishingOptions.map((f) => (
            <option key={f} value={f}>
              {f === 'All' ? 'Any Furnishing' : f}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities Checklist */}
      <div className="mb-2">
        <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
          Amenities & Features
        </label>
        <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {amenityOptions.map((amenity) => {
            const checked = selectedAmenities.includes(amenity);
            return (
              <div className="form-check" key={amenity}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`filter-${amenity}`}
                  checked={checked}
                  onChange={() => handleAmenityToggle(amenity)}
                />
                <label
                  className="form-check-label small text-secondary cursor-pointer"
                  htmlFor={`filter-${amenity}`}
                >
                  {amenity}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
