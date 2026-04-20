import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import './HeroCarousel.css';
import heroBanner from '../assets/hero-banner.png';

const heroContent = [
  {
    id: 1,
    title: "Drive Media Vault",
    image: heroBanner,
    tags: ["Cloud Storage", "Instant Sync", "Secure"],
    description: "Stream and download your personal movie collection directly from Google Drive. Premium speed, high-quality playback, and secure one-time download capability.",
    rating: "Premium",
    year: "2024",
    duration: "Unlimited Storage"
  }
];

const HeroCarousel = () => {
  return (
    <div className="hero-section" id="home">
      <Carousel 
        fade 
        interval={10000} 
        controls={false} 
        indicators={true}
        className="hero-carousel"
      >
        {heroContent.map((movie) => (
          <Carousel.Item key={movie.id}>
            <div 
              className="carousel-bg" 
              style={{ backgroundImage: `url(${movie.image})` }}
            >
              <Container className="h-100 d-flex align-items-center">
                <Row>
                  <Col lg={8} md={10}>
                    <div className="mb-4 hero-tags">
                       {movie.tags.map((tag, index) => (
                         <span key={index} className="badge bg-primary-red me-2 text-uppercase py-2 px-3 shadow-sm" style={{fontSize: '0.7rem', borderRadius: '30px'}}>{tag}</span>
                       ))}
                    </div>
                    <h1 className="display-1 fw-bold mb-3 movie-title-hero text-glow">
                      {movie.title}
                    </h1>
                    <div className="hero-meta mb-4">
                      <span className="fw-bold text-primary-red d-flex align-items-center gap-2">
                        <i className="bi bi-shield-check-fill fs-5"></i> {movie.rating}
                      </span>
                      <span>{movie.year}</span>
                      <span className="d-flex align-items-center gap-2">
                        <i className="bi bi-hdd-network"></i> {movie.duration}
                      </span>
                    </div>
                    <p className="movie-description-hero d-none d-md-block mb-5">
                      {movie.description}
                    </p>
                    <div className="hero-btns">
                      <button 
                        className="btn btn-primary-red px-5 py-3 fw-bold glow-on-hover"
                        onClick={() => document.querySelector('.shows-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        EXPLORE YOUR VAULT
                      </button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
