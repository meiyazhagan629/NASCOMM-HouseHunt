import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25" style={{ background: '#0b0f19' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)'
                }}
              >
                <i className="bi bi-building"></i>
              </div>
              <span className="fw-bold fs-4 font-heading text-white">
                House<span style={{ color: '#818cf8' }}>Hunt</span>
              </span>
            </div>
            <p className="text-secondary small mb-3" style={{ lineHeight: '1.7' }}>
              The modern all-in-one house rental and property management platform. Connecting verified renters with trusted property owners with zero hidden brokerage, 360 virtual tours, and seamless online scheduling.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <a href="#twitter" className="text-secondary hover-primary"><i className="bi bi-twitter-x fs-5"></i></a>
              <a href="#facebook" className="text-secondary hover-primary"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#instagram" className="text-secondary hover-primary"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#linkedin" className="text-secondary hover-primary"><i className="bi bi-linkedin fs-5"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3 small font-heading">
              Quick Navigation
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><Link to="/properties" className="text-secondary text-decoration-none hover-white">Explore Rentals</Link></li>
              <li><Link to="/post-property" className="text-secondary text-decoration-none hover-white">List Your Property</Link></li>
              <li><Link to="/dashboard" className="text-secondary text-decoration-none hover-white">User Dashboard</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none hover-white">Sign In / Sign Up</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3 small font-heading">
              Top Rental Markets
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><Link to="/properties?city=New+York" className="text-secondary text-decoration-none hover-white">New York Apartments</Link></li>
              <li><Link to="/properties?city=San+Francisco" className="text-secondary text-decoration-none hover-white">San Francisco Lofts & Villas</Link></li>
              <li><Link to="/properties?city=Austin" className="text-secondary text-decoration-none hover-white">Austin Lakefront Condos</Link></li>
              <li><Link to="/properties?city=Miami" className="text-secondary text-decoration-none hover-white">Miami Beach Penthouses</Link></li>
              <li><Link to="/properties?city=Seattle" className="text-secondary text-decoration-none hover-white">Seattle Family Houses</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3 small font-heading">
              Trust & Support
            </h6>
            <div className="p-3 rounded-3 mb-3 border border-secondary border-opacity-25" style={{ background: '#111827' }}>
              <div className="d-flex align-items-center gap-2 text-warning mb-1">
                <i className="bi bi-shield-lock-fill"></i>
                <span className="fw-bold small text-white">100% Verified Listings</span>
              </div>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
                Every house is moderated by our verification team before going live on the platform.
              </p>
            </div>
            <div className="text-secondary small">
              <i className="bi bi-envelope me-2 text-primary"></i> support@househunt.com
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-3" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <div>
            &copy; {new Date().getFullYear()} HouseHunt Inc. All rights reserved. Built with MERN Stack.
          </div>
          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>&bull;</span>
            <span>Terms of Service</span>
            <span>&bull;</span>
            <span>Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
