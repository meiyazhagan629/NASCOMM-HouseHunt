import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import VirtualTourModal from '../components/VirtualTourModal';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTourProperty, setActiveTourProperty] = useState(null);

  // Quick Hero Search Form State
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('All');
  const [searchBudget, setSearchBudget] = useState('5000');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties?limit=6');
        setFeaturedProperties(res.data.properties || []);
      } catch (err) {
        console.error('Error fetching featured listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity && searchCity !== 'All') params.append('city', searchCity);
    if (searchType && searchType !== 'All') params.append('propertyType', searchType);
    if (searchBudget) params.append('maxPrice', searchBudget);
    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    { name: 'Apartment', icon: 'bi-building', count: '1,240+' },
    { name: 'Villa', icon: 'bi-tree', count: '380+' },
    { name: 'Studio', icon: 'bi-door-closed', count: '620+' },
    { name: 'Independent House', icon: 'bi-house-heart', count: '890+' },
    { name: 'Penthouse', icon: 'bi-stars', count: '150+' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-wrapper position-relative">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="container position-relative" style={{ zIndex: 5 }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-9">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 text-light mb-3">
                <span className="badge bg-primary">NEW</span>
                <small className="fw-semibold">Next-Gen Real Estate Experience with 360° Tours</small>
              </div>

              <h1 className="display-4 fw-bold font-heading text-white mb-3" style={{ letterSpacing: '-0.03em' }}>
                Find Your Dream Home with Zero Compromise.
              </h1>
              <p className="lead text-light opacity-75 mb-4 mx-auto" style={{ maxWidth: '680px' }}>
                HouseHunt connects verified renters directly with vetted property hosts. Experience immersive 360° virtual tours, transparent pricing, and instant visit bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Hero Search Box */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="search-box-card">
              <form onSubmit={handleSearchSubmit}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i> Location / City
                    </label>
                    <select
                      className="form-select bg-light border"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                    >
                      <option value="">Any City (Nationwide)</option>
                      <option value="New York">New York, NY</option>
                      <option value="San Francisco">San Francisco, CA</option>
                      <option value="Austin">Austin, TX</option>
                      <option value="Chicago">Chicago, IL</option>
                      <option value="Miami">Miami, FL</option>
                      <option value="Seattle">Seattle, WA</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                      <i className="bi bi-house-door-fill text-primary me-1"></i> Property Type
                    </label>
                    <select
                      className="form-select bg-light border"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Studio">Studio</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                      <i className="bi bi-cash-stack text-success me-1"></i> Max Budget: ${Number(searchBudget).toLocaleString()}
                    </label>
                    <input
                      type="range"
                      className="form-range mt-2"
                      min="1000"
                      max="10000"
                      step="250"
                      value={searchBudget}
                      onChange={(e) => setSearchBudget(e.target.value)}
                    />
                  </div>

                  <div className="col-md-2">
                    <button type="submit" className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2">
                      <i className="bi bi-search"></i>
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Property Categories Strip */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold font-heading mb-1">Explore by Category</h3>
              <p className="text-muted small mb-0">Browse through hand-curated property categories tailored to your lifestyle</p>
            </div>
            <Link to="/properties" className="text-primary fw-semibold small text-decoration-none hover-underline">
              View All Types &rarr;
            </Link>
          </div>

          <div className="row g-3">
            {categories.map((cat) => (
              <div className="col-6 col-md" key={cat.name}>
                <Link
                  to={`/properties?propertyType=${encodeURIComponent(cat.name)}`}
                  className="card card-custom p-3 text-center text-decoration-none h-100 d-flex flex-column align-items-center justify-content-center"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                    style={{ width: '52px', height: '52px', backgroundColor: '#eef2ff', color: '#4f46e5' }}
                  >
                    <i className={`bi ${cat.icon} fs-4`}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1 font-heading">{cat.name}</h6>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{cat.count} listings</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Listings Section */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-success text-white">
                  <i className="bi bi-patch-check-fill me-1"></i> 100% Moderated
                </span>
                <h3 className="fw-bold font-heading mb-0">Featured Rental Properties</h3>
              </div>
              <p className="text-muted small mb-0">Verified rentals with high ratings, instant scheduling, and virtual walkthroughs</p>
            </div>
            <Link to="/properties" className="btn btn-outline-custom">
              Explore All Listings ({featuredProperties.length}+)
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading properties...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProperties.map((property) => (
                <div className="col-md-6 col-lg-4" key={property._id}>
                  <PropertyCard
                    property={property}
                    onOpenVirtualTour={(prop) => setActiveTourProperty(prop)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose HouseHunt Value Proposition */}
      <section className="py-5">
        <div className="container">
          <div className="text-center max-w-lg mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill mb-2">
              WHY HOUSEHUNT
            </span>
            <h2 className="fw-bold font-heading mb-2">Renting Reimagined From the Ground Up</h2>
            <p className="text-muted small">We eliminated the headaches of traditional house hunting with verified listings, digital tours, and direct host messaging.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', background: '#dbeafe', color: '#1d4ed8' }}
                >
                  <i className="bi bi-shield-check fs-2"></i>
                </div>
                <h5 className="fw-bold font-heading mb-2">Zero Fake Listings</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                  Every single rental on HouseHunt passes our rigorous admin moderation workflow before going live. No phantom listings or bait-and-switch pricing.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', background: '#e0e7ff', color: '#4338ca' }}
                >
                  <i className="bi bi-camera-video fs-2"></i>
                </div>
                <h5 className="fw-bold font-heading mb-2">360° Virtual Walkthroughs</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                  Tour properties from your phone or desktop before scheduling an in-person visit. Inspect room dimensions, floor plans, and natural lighting easily.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#15803d' }}
                >
                  <i className="bi bi-calendar-check fs-2"></i>
                </div>
                <h5 className="fw-bold font-heading mb-2">Direct Host Booking</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                  Connect directly with verified landlords. Schedule visits with instant calendar confirmation and zero intermediate broker fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Stats Counter */}
      <section className="py-5 bg-dark text-white position-relative" style={{ background: '#0f172a' }}>
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="display-5 fw-bold font-heading text-primary mb-1">5,000+</div>
                <div className="text-light opacity-75 small fw-semibold">Verified Listings</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="display-5 fw-bold font-heading text-info mb-1">12,400+</div>
                <div className="text-light opacity-75 small fw-semibold">Happy Renters Housed</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="display-5 fw-bold font-heading text-success mb-1">99.8%</div>
                <div className="text-light opacity-75 small fw-semibold">Listing Verification Rate</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="display-5 fw-bold font-heading text-warning mb-1">24 / 7</div>
                <div className="text-light opacity-75 small fw-semibold">Dedicated Concierge</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landlord CTA Banner */}
      <section className="py-5">
        <div className="container">
          <div
            className="p-5 rounded-4 text-white position-relative overflow-hidden shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)'
            }}
          >
            <div className="row align-items-center">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <span className="badge bg-warning text-dark fw-bold px-3 py-1 mb-2">FOR PROPERTY OWNERS</span>
                <h2 className="display-6 fw-bold font-heading mb-2">Have a House or Apartment to Rent Out?</h2>
                <p className="lead opacity-80 mb-0" style={{ fontSize: '1.05rem' }}>
                  List your property on HouseHunt for free. Connect with pre-screened tenants, manage visit appointments in real-time, and get maximum visibility.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/post-property" className="btn btn-light btn-lg px-4 py-3 fw-bold shadow">
                  <i className="bi bi-plus-circle me-2 text-primary"></i> Post Your Listing Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default Home;
