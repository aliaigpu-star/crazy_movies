import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaHeadphones } from 'react-icons/fa';
import './AudiobookSection.css';

const books = [
  { id: 1, title: "The White Tiger", author: "Aravind Adiga", image: "https://upload.wikimedia.org/wikipedia/en/2/24/The_White_Tiger_film_poster.jpg", duration: "11h 30m" },
  { id: 2, title: "Shantaram", author: "Gregory D. Roberts", image: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg", duration: "42h 15m" },
  { id: 3, title: "The God of Small Things", author: "Arundhati Roy", image: "https://covers.openlibrary.org/b/isbn/9780812979657-L.jpg", duration: "13h 10m" },
  { id: 4, title: "Train to Pakistan", author: "Khushwant Singh", image: "https://upload.wikimedia.org/wikipedia/en/a/a8/Train_to_Pakistan_%28film%29.jpg", duration: "6h 45m" },
  { id: 5, title: "Midnight's Children", author: "Salman Rushdie", image: "https://upload.wikimedia.org/wikipedia/en/a/a3/Midnight%27s_Children_Poster.jpg", duration: "24h 20m" },
  { id: 6, title: "A Suitable Boy", author: "Vikram Seth", image: "https://upload.wikimedia.org/wikipedia/en/d/d7/A_Suitable_Boy_Title_Card.png", duration: "55h 50m" },
];

const AudiobookSection = () => {
  return (
    <section className="audiobook-section py-5 bg-dark-custom reveal">
      <Container fluid className="px-4 px-lg-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h6 className="text-primary-red text-uppercase fw-bold mb-1">Online Streaming</h6>
            <h2 className="fw-bold display-6">Listen Audiobooks</h2>
          </div>
          <a href="#" className="text-decoration-none text-white-50 hover-white d-none d-md-block">View All →</a>
        </div>

        <div className="book-slider">
          {books.map((book) => (
            <div key={book.id} className="book-card-wrapper">
              <Card className="book-card bg-transparent border-0 text-center">
                <div className="book-img-container rounded-3 mb-3">
                  <Card.Img src={book.image} className="img-fluid" />
                  <div className="book-overlay d-flex align-items-center justify-content-center">
                     <div className="listen-btn">
                        <FaHeadphones size={24} />
                     </div>
                  </div>
                </div>
                <Card.Body className="p-0">
                  <Card.Title className="fs-6 fw-bold mb-1 text-truncate">{book.title}</Card.Title>
                  <Card.Text className="text-white-50 small">
                    {book.author}
                  </Card.Text>
                  <div className="text-primary-red tiny-text fw-bold">{book.duration}</div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
           <Button className="btn btn-outline-danger px-4 py-2 text-uppercase fw-bold">Browse All Audiobooks</Button>
        </div>
      </Container>
    </section>
  );
};

export default AudiobookSection;
