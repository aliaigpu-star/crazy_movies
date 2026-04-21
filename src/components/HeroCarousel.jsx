import React, { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import './HeroCarousel.css';

// Background slideshow images from your movie collection
import heroBanner from '../assets/hero-banner.png';
import baahubaliLandscape from '../assets/moviepic/Baahubali_landscape.jpg';
import kalki from '../assets/moviepic/kalki.jpg';
import rrrLandscape from '../assets/moviepic/rrr_landscape.jpg';

const bgSlides = [
  { id: 1, image: heroBanner, label: 'Drive Vault' },
  { id: 2, image: baahubaliLandscape, label: 'Baahubali' },
  { id: 3, image: kalki, label: 'Kalki' },
  { id: 4, image: rrrLandscape, label: 'RRR' },
];

const HeroCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((nextIndex) => {
    if (isTransitioning || nextIndex === activeSlide) return;
    setIsTransitioning(true);
    setPrevSlide(activeSlide);
    setActiveSlide(nextIndex);
    setTimeout(() => {
      setPrevSlide(null);
      setIsTransitioning(false);
    }, 1200);
  }, [activeSlide, isTransitioning]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeSlide + 1) % bgSlides.length;
      goToSlide(nextIndex);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide, goToSlide]);

  return (
    <div className="hero-section" id="home">
      {/* ─── Background Slideshow ─── */}
      <div className="hero-bg-slideshow">
        {bgSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-bg-slide ${
              index === activeSlide ? 'slide-active' : ''
            } ${index === prevSlide ? 'slide-exiting' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      {/* ─── Bottom Gradient Only ─── */}
      <div className="hero-bottom-gradient" />

      {/* ─── Content — Floating Over Image ─── */}
      <Container className="hero-overlay-content">
        {/* Left-aligned cinematic text */}
        <div className="hero-text-group">
          <div className="hero-tagline">
            <span className="tagline-dot"></span>
            <span>TRENDING NOW</span>
          </div>

          <h1 className="hero-headline">
            <span className="headline-line">Discover. Watch.</span>
            <span className="headline-line headline-accent">Enjoy<span className="accent-dot">.</span></span>
          </h1>

          <p className="hero-subtext">
            Explore the latest blockbusters, timeless classics, and hidden gems.<br className="d-none d-md-block" />
            All in one place — stream anytime, anywhere.
          </p>

          <div className="hero-actions">
            <button
              className="hero-btn-primary"
              onClick={() => document.querySelector('.shows-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="bi bi-play-fill"></i>
              <span>Explore Library</span>
            </button>
            <button
              className="hero-btn-ghost"
              onClick={() => document.querySelector('#movies-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="bi bi-grid-3x3-gap-fill"></i>
              <span>Browse All</span>
            </button>
          </div>
        </div>

        {/* Right-side floating stats */}
        <div className="hero-stats-float">
          <div className="stat-item">
            <span className="stat-value">4K</span>
            <span className="stat-desc">Quality</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">AES</span>
            <span className="stat-desc">Encrypted</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">∞</span>
            <span className="stat-desc">Storage</span>
          </div>
        </div>
      </Container>

      {/* ─── Slide Indicators ─── */}
      <div className="hero-slide-indicators">
        {bgSlides.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-dot ${index === activeSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.label}`}
          >
            <span className="hero-dot-progress" />
          </button>
        ))}
      </div>

      {/* ─── Scroll Hint ─── */}
      <div className="hero-scroll-hint">
        <div className="scroll-line"></div>
        <span>SCROLL</span>
      </div>
    </div>
  );
};

export default HeroCarousel;
