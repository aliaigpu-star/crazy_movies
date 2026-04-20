import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPlay } from 'react-icons/fa';
import './ShowsCarousel.css';

const shows = [
  { id: 1, title: "Sacred Games", image: "https://image.tmdb.org/t/p/w500/tOSO9KyC4AKZ5KuhMSfsdGEwIow.jpg", season: "Season 2", year: "2019" },
  { id: 2, title: "Mirzapur", image: "https://upload.wikimedia.org/wikipedia/en/1/1a/Mirzapur_Logo.png", season: "Season 3", year: "2024" },
  { id: 3, title: "The Family Man", image: "https://upload.wikimedia.org/wikipedia/en/a/aa/The_Family_Man_logo.webp", season: "Season 2", year: "2021" },
  { id: 4, title: "Panchayat", image: "https://upload.wikimedia.org/wikipedia/en/a/ac/Panchayat_%28TV_series%29_logo.png", season: "Season 3", year: "2024" },
  { id: 5, title: "Scam 1992", image: "https://upload.wikimedia.org/wikipedia/en/c/c8/Scam_1992_poster.png", season: "Season 1", year: "2020" },
  { id: 6, title: "Asur", image: "https://upload.wikimedia.org/wikipedia/en/6/69/Asur_Title.jpg", season: "Season 2", year: "2023" },
];

const ShowsCarousel = () => {
  return (
    <section className="shows-carousel-section py-5 reveal">
      <Container fluid className="px-4 px-lg-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h6 className="text-primary-red text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>Online Streaming</h6>
            <h2 className="fw-bold fs-1">Watch Shows Online</h2>
          </div>
          <a href="#" className="text-decoration-none text-white-50 hover-white d-none d-md-block">View All →</a>
        </div>
        
        <div className="shows-slider">
          {shows.map((show) => (
            <div key={show.id} className="show-card-wrapper">
              <Card className="show-card bg-transparent border-0">
                <div className="card-img-container">
                  <Card.Img src={show.image} className="rounded-3" />
                  <div className="card-overlay d-flex align-items-center justify-content-center">
                    <div className="play-btn-circle">
                      <FaPlay size={20} />
                    </div>
                  </div>
                </div>
                <Card.Body className="px-0 pt-3">
                  <Card.Title className="fs-5 fw-bold mb-1 text-truncate">{show.title}</Card.Title>
                  <Card.Text className="text-white-50 fs-6">
                    {show.season} • {show.year}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ShowsCarousel;
