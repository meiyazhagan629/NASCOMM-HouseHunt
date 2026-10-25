import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import VirtualTourModal from '../components/VirtualTourModal';
import api from '../services/api';

const Properties = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeTourProperty, setActiveTourProperty] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize filters from URL search params
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      keyword: params.get('keyword') || '',
      city: params.get('city') || 'All',
      propertyType: params.get('propertyType') || 'All',
      bedrooms: params.get('bedrooms') || 'All',
      maxPrice: params.get('maxPrice') || '10000',
      furnishing: params.get('furnishing') || 'All',
      amenities: params.get('amenities') || '',
      sort: params.get('sort') || 'newest'
    };
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.city && filters.city !== 'All') params.append('city', filters.city);
      if (filters.propertyType && filters.propertyType !== 'All') params.append('propertyType', filters.propertyType);
      if (filters.bedrooms && filters.bedrooms !== 'All') params.append('bedrooms', filters.bedrooms);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.furnishing && filters.furnishing !== 'All') params.append('furnishing', filters.furnishing);
      if (filters.amenities) params.append('amenities', filters.amenities);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', currentPage);
      params.append('limit', 9);

      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data.properties || []);
      setTotalCount(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error querying properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, currentPage]);

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      city: 'All',
      propertyType: 'All',
      bedrooms: 'All',
      maxPrice: '10000',
      furnishing: 'All',
      amenities: '',
      sort: 'newest'
    });
    setCurrentPage(1);
    navigate('/properties');
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb small mb-1">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Explore Properties</li>
              </ol>
            </nav>
            <h2 className="fw-bold font-heading mb-0">Browse Verified Rentals</h2>
            <p className="text-muted small mb-0">
              Showing <strong>{totalCount}</strong> available homes matching your criteria
            </p>
          </div>

          {/* Sort & View Mode Controls */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-semibold text-muted text-nowrap">Sort by:</label>
              <select
                className="form-select form-select-sm bg-white border shadow-sm"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                style={{ width: '160px' }}
              >
                <option value="newest">Newest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="bedrooms">Bedrooms (High-Low)</option>
              </select>
            </div>

            <div className="btn-group btn-group-sm shadow-sm" role="group">
              <button
                type="button"
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <i className="bi bi-grid-fill"></i>
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <i className="bi bi-list-ul"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Layout Row */}
        <div className="row g-4">
          {/* Filters Sidebar */}
          <div className="col-lg-3">
            <PropertyFilter
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Properties Grid / List */}
          <div className="col-lg-9">
            {/* Active Filter Tags */}
            {(filters.city !== 'All' || filters.propertyType !== 'All' || filters.bedrooms !== 'All' || filters.keyword) && (
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="small text-muted fw-bold">Active Filters:</span>
                {filters.city !== 'All' && (
                  <span className="badge bg-white text-dark border d-flex align-items-center gap-1 py-1 px-2">
                    City: {filters.city}
                    <i className="bi bi-x cursor-pointer" onClick={() => setFilters({ ...filters, city: 'All' })}></i>
                  </span>
                )}
                {filters.propertyType !== 'All' && (
                  <span className="badge bg-white text-dark border d-flex align-items-center gap-1 py-1 px-2">
                    Type: {filters.propertyType}
                    <i className="bi bi-x cursor-pointer" onClick={() => setFilters({ ...filters, propertyType: 'All' })}></i>
                  </span>
                )}
                {filters.bedrooms !== 'All' && (
                  <span className="badge bg-white text-dark border d-flex align-items-center gap-1 py-1 px-2">
                    {filters.bedrooms} Beds
                    <i className="bi bi-x cursor-pointer" onClick={() => setFilters({ ...filters, bedrooms: 'All' })}></i>
                  </span>
                )}
                {filters.keyword && (
                  <span className="badge bg-white text-dark border d-flex align-items-center gap-1 py-1 px-2">
                    Keyword: "{filters.keyword}"
                    <i className="bi bi-x cursor-pointer" onClick={() => setFilters({ ...filters, keyword: '' })}></i>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading properties...</span>
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="card-custom p-5 text-center my-4">
                <div
                  className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '70px', height: '70px' }}
                >
                  <i className="bi bi-house-exclamation fs-1 text-muted"></i>
                </div>
                <h4 className="fw-bold font-heading text-dark mb-1">No Matching Properties Found</h4>
                <p className="text-muted small mb-3">
                  We couldn't find any rentals matching your exact filter combination. Try adjusting your budget slider or clearing specific amenity filters.
                </p>
                <div>
                  <button onClick={handleResetFilters} className="btn btn-primary-custom px-4 py-2">
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {properties.map((property) => (
                    <div
                      key={property._id}
                      className={viewMode === 'grid' ? 'col-md-6 col-xl-4' : 'col-12'}
                    >
                      <PropertyCard
                        property={property}
                        onOpenVirtualTour={(prop) => setActiveTourProperty(prop)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <nav aria-label="Page navigation">
                      <ul className="pagination shadow-sm">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                          <li
                            key={num}
                            className={`page-item ${currentPage === num ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(num)}
                            >
                              {num}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Virtual Tour Modal */}
      {activeTourProperty && (
        <VirtualTourModal
          property={activeTourProperty}
          onClose={() => setActiveTourProperty(null)}
        />
      )}
    </div>
  );
};

export default Properties;
