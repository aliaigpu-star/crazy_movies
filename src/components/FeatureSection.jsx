import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTv, FaBan, FaShieldAlt } from 'react-icons/fa';
import './FeatureSection.css';

const mockupImg = "https://picsum.photos/seed/indian-cinema/800/600";

const FeatureSection = () => {
  return (
    <section className="feature-section py-5 reveal">
      <Container className="py-lg-5">
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0 order-2 order-lg-1">
            <div className="mockup-container">
              <div className="phone-mockup">
                 <img src={mockupImg} alt="App Mockup" className="img-fluid rounded-4 shadow-lg" />
                 <div className="floating-ui card-1 p-3 rounded-3 shadow">
                    <div className="d-flex align-items-center">
                       <div className="record-dot me-2"></div>
                       <span className="fw-bold small">Direct Streaming</span>
                    </div>
                 </div>
                 <div className="floating-ui card-2 p-3 rounded-3 shadow">
                    <span className="text-primary-red fw-bold fs-4">4K</span>
                    <p className="mb-0 small">Ultra HD</p>
                 </div>
              </div>
            </div>
          </Col>
          <Col lg={6} className="ps-lg-5 order-1 order-lg-2 mb-5 mb-lg-0">
            <h6 className="text-primary-red text-uppercase fw-bold mb-2">Online Streaming</h6>
            <h2 className="display-5 fw-bold mb-4">
              Best pick for hassle-free <span className="text-primary-red border-bottom border-3 border-danger">streaming</span> experience.
            </h2>
            
            <div className="features-list mt-5">
              <div className="feature-item d-flex mb-4">
                <div className="feature-icon-box me-4">
                  <FaTv className="text-primary-red" size={24} />
                </div>
                <div>
                  <h4 className="fw-bold fs-5">Access while traveling</h4>
                  <p className="text-white-50">Keep up to date with your entertainment content while traveling to another TV or from thousands.</p>
                </div>
              </div>

              <div className="feature-item d-flex mb-4">
                <div className="feature-icon-box me-4">
                  <FaBan className="text-primary-red" size={24} />
                </div>
                <div>
                  <h4 className="fw-bold fs-5">Stream with no interruptions</h4>
                  <p className="text-white-50">Watch TV shows, series, films directly with no <span className="text-white-50 text-decoration-underline">ads, breaks, popups</span> or interruptions.</p>
                </div>
              </div>

              <div className="feature-item d-flex mb-4">
                <div className="feature-icon-box me-4">
                  <FaShieldAlt className="text-primary-red" size={24} />
                </div>
                <div>
                  <h4 className="fw-bold fs-5">Stay secure at all times</h4>
                  <p className="text-white-50">Rest relax and enjoy your favorite content in <span className="text-white">public Wi-Fi</span>. Personalized for you.</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeatureSection;
