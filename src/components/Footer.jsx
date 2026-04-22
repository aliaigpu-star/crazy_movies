import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section pt-5 pb-3">
      <Container className="px-4 px-lg-5">
        <Row className="mb-5 g-4">
          <Col lg={5} md={12}>
            <div className="footer-brand mb-4 d-flex align-items-center">
              <img src="/favicon.png" alt="logo" className="me-2" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <h3 className="fw-bold text-primary-red fs-3 mb-0">NewMovies</h3>
            </div>
            <p className="text-white-50 mb-4 pe-lg-5">
              Your private movie vault powered by Google Drive. Stream and download your personal collection with premium speed, 
              high-quality playback, and secure access.
            </p>
            <div className="social-links d-flex gap-3">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
            </div>
          </Col>
          
          <Col lg={3} md={4} sm={6}>
            <h5 className="fw-bold mb-4 text-white">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#featured-section">Featured</a></li>
              <li><a href="#movies-section">Browse Library</a></li>
            </ul>
          </Col>
          
          <Col lg={4} md={4}>
            <h5 className="fw-bold mb-4 text-white">Features</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#"><i className="bi bi-cloud-arrow-down me-2"></i>Direct Downloads</a></li>
              <li><a href="#"><i className="bi bi-play-circle me-2"></i>Online Streaming</a></li>
              <li><a href="#"><i className="bi bi-shield-lock me-2"></i>Secure Vault Proxy</a></li>
              <li><a href="#"><i className="bi bi-speedometer2 me-2"></i>Ultra-Fast Seeking</a></li>
              <li><a href="#"><i className="bi bi-folder2-open me-2"></i>Multi-Folder Support</a></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="border-secondary opacity-25" />
        
        <div className="footer-bottom text-center pt-3">
          <small className="text-white-30">© 2026 NewMovies. Private Media Vault.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
