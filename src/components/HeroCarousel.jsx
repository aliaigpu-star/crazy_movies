import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import './HeroCarousel.css';
import heroBanner from '../assets/hero-banner.png';

const movies = [
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
    <div className="hero-section">
      <Carousel 
        fade 
        interval={10000} 
        controls={false} 
        indicators={true}
        className="hero-carousel"
      >
        {movies.map((movie) => (
          <Carousel.Item key={movie.id}>
            <div 
              className="carousel-bg" 
              style={{ backgroundImage: `linear-gradient(to right, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.4) 60%, rgba(8, 8, 8, 0.2) 100%), url(${movie.image})` }}
            >
              <Container className="h-100 d-flex align-items-center">
                <Row>
                  <Col lg={8} md={10} className="text-white">
                    <div className="mb-3 reveal visible">
                       {movie.tags.map((tag, index) => (
                         <span key={index} className="badge bg-primary-red me-2 text-uppercase py-2 px-3" style={{fontSize: '0.7rem', borderRadius: '20px'}}>{tag}</span>
                       ))}
                    </div>
                    <h1 className="display-1 fw-bold mb-3 movie-title text-glow">
                      {movie.title}
                    </h1>
                    <div className="d-flex align-items-center mb-4 movie-meta text-muted">
                      <span className="me-3 fw-bold text-primary-red"><i className="bi bi-shield-check"></i> {movie.rating}</span>
                      <span className="me-3">{movie.year}</span>
                      <span className="me-3"><i className="bi bi-hdd-network me-1"></i> {movie.duration}</span>
                      <span className="badge border border-secondary text-secondary">PRIVATE ACCESS</span>
                    </div>
                    <p className="lead mb-5 movie-description d-none d-md-block opacity-75" style={{maxWidth: '600px'}}>
                      {movie.description}
                    </p>
                    <div className="d-flex gap-3 hero-btns">
                      <button 
                        className="btn btn-primary-red px-5 py-3 fw-bold glow-on-hover"
                        onClick={() => document.querySelector('.shows-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        EXPLORE VAULT
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
