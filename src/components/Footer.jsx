import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section pt-5 pb-3">
      <Container className="px-4 px-lg-5">
        <Row className="mb-5 g-4">
          <Col lg={4} md={12}>
            <div className="footer-brand mb-4">
              <h3 className="fw-bold text-primary-red fs-3"><span className="logo-icon me-2">▶</span> MOVIEBOX</h3>
            </div>
            <p className="text-white-50 mb-4 pe-lg-5">
              Experience the best online streaming with MovieBox. Thousands of movies, TV shows, and audiobooks at your fingertips. Subscribe now and start your journey.
            </p>
            <div className="social-links d-flex gap-3">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
            </div>
          </Col>
          
          <Col lg={2} md={4} sm={6}>
            <h5 className="fw-bold mb-4 text-white">Explore</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Movies</a></li>
              <li><a href="#">TV Shows</a></li>
              <li><a href="#">Audiobooks</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </Col>
          
          <Col lg={2} md={4} sm={6}>
            <h5 className="fw-bold mb-4 text-white">Support</h5>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Account</a></li>
          </Col>
          
          <Col lg={4} md={4}>
            <h5 className="fw-bold mb-4 text-white">Reach Us</h5>
            <div className="d-flex align-items-center mb-3">
              <FaPhone className="text-primary-red me-3" />
              <span className="text-white-50">+1 (800) 123-4567</span>
            </div>
            <div className="d-flex align-items-center mb-4">
              <FaEnvelope className="text-primary-red me-3" />
              <span className="text-white-50">support@moviebox.com</span>
            </div>
            <p className="small text-white-30">
               © 2026 MovieBox. All Rights Reserved. Created for demo purposes.
            </p>
          </Col>
        </Row>
        
        <hr className="border-secondary opacity-25" />
        
        <div className="footer-bottom text-center pt-3">
          <small className="text-white-30">Powered by Antigravity AI Engine</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
