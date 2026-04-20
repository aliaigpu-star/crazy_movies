import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { 
  fetchMoviesFromDrive, 
  isDownloaded as checkIsDownloaded, 
  markAsDownloaded,
  saveDownloadSession,
  consumeDownloadSession 
} from '../services/googleDrive';
import './ShowsGrid.css';
import AdGateModal from './AdGateModal';

const ShowsGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showAdGate, setShowAdGate] = useState(false);
  const [pendingDownloadMovie, setPendingDownloadMovie] = useState(null);
  
  const [downloadFeedback, setDownloadFeedback] = useState(null); 

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const { movies: data, isDemo } = await fetchMoviesFromDrive();
        setMovies(data);
        if (isDemo) {
          setError("Demo Mode: Configure your Google Drive API Key in .env to access your own vault.");
        } else {
          setError(null);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to connect to the backend. Please ensure the dev server is running.");
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const handleWatch = (movie) => {
    setSelectedMovie(movie);
    setShowPlayer(true);
  };

  const handleDownload = async (movie) => {
    setDownloadFeedback(null);
    setPendingDownloadMovie(movie);
    setShowAdGate(true);
  };

  const completeAdAndDownload = useCallback(async () => {
    const movie = pendingDownloadMovie;
    if (!movie?.id) return;

    setDownloadingId(movie.id);

    try {
      const gateRes = await fetch(`/api/gate?id=${encodeURIComponent(movie.id)}`);
      if (!gateRes.ok) {
        const text = await gateRes.text();
        throw new Error(text || 'Failed to unlock download');
      }
      const { token, nonce } = await gateRes.json();
      if (!token) throw new Error('Missing download token');

      const downloadUrl = `/api/download?id=${encodeURIComponent(movie.id)}&token=${encodeURIComponent(token)}`;
      saveDownloadSession(movie.id, token, nonce);
      window.open(downloadUrl, '_blank');
      consumeDownloadSession(movie.id);
      markAsDownloaded(movie.id);
      setMovies((prev) => [...prev]);

      setDownloadFeedback({
        type: 'success',
        message: `"${movie.title}" download started!`
      });

    } catch (err) {
      console.error('Download failed', err);
      setDownloadFeedback({
        type: 'error',
        message: 'Download failed. Please try again.'
      });
    } finally {
      setDownloadingId(null);
      setPendingDownloadMovie(null);
    }
  }, [pendingDownloadMovie]);

  useEffect(() => {
    if (!downloadFeedback) return;
    const t = setTimeout(() => setDownloadFeedback(null), 8000);
    return () => clearTimeout(t);
  }, [downloadFeedback]);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="danger" />
      <p className="mt-3 text-muted">Scanning Google Drive Vault...</p>
    </div>
  );

  return (
    <section className="shows-grid-section py-5" id="movies-section">
      <Container className="px-4">
        <div className="text-center mb-5 reveal visible">
          <div className="section-divider"></div>
          <h6 className="text-primary-red text-uppercase fw-bold mb-2" style={{letterSpacing: '3px'}}>Secure Media Library</h6>
          <h2 className="fw-bold display-5 mb-3 text-glow">Drive Movies Vault</h2>
          <div className="movie-count-pill mb-4">
            <i className="bi bi-collection-play"></i>
            <span>Library Status: <span className="count">{movies.length} Movies</span> Ready</span>
          </div>
          
          <div className="mx-auto mt-2 mb-5">
            <div className="search-input-group d-flex align-items-center mx-auto" style={{maxWidth: '550px'}}>
              <i className="bi bi-search text-muted me-3"></i>
              <input 
                type="text" 
                className="form-control bg-transparent border-0 shadow-none" 
                placeholder="Find a movie in your collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="btn btn-sm text-muted border-0 p-0" 
                  onClick={() => setSearchQuery('')}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <Alert variant="danger" className="text-danger border-danger glass-card mb-5">{error}</Alert>}

        {downloadFeedback && (
          <Alert 
            variant={downloadFeedback.type === 'success' ? 'success' : 'danger'} 
            className={`download-feedback-alert glass-card mb-5 ${downloadFeedback.type === 'success' ? 'text-success border-success' : 'text-danger border-danger'}`}
            dismissible
            onClose={() => setDownloadFeedback(null)}
          >
            <i className={`bi ${downloadFeedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {downloadFeedback.message}
          </Alert>
        )}

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredMovies.map((movie) => {
            const hasDownloaded = checkIsDownloaded(movie.id);
            return (
              <Col key={movie.id} className="reveal visible">
                <Card className="grid-show-card glass-card border-0 h-100 shadow-lg overflow-hidden">
                  <div className="grid-img-container position-relative overflow-hidden" style={{height: '380px'}}>
                    <Card.Img src={movie.image} className="img-fluid h-100 object-fit-cover" />
                    
                    <div className="position-absolute top-0 start-0 p-3 d-flex flex-column gap-2">
                      <span className="premium-badge badge-hd shadow-sm">HD 1080p</span>
                      <span className="premium-badge badge-fast shadow-sm">Ultra Fast</span>
                    </div>

                    <div className="grid-overlay d-flex flex-column gap-2 p-3 justify-content-end">
                       <Button 
                        variant="primary" 
                        className="btn-primary-blue w-100 py-3 fw-bold mb-1"
                        onClick={() => handleWatch(movie)}
                       >
                         <i className="bi bi-play-fill me-2 fs-5"></i> WATCH ONLINE
                       </Button>
                       <Button 
                        variant="danger" 
                        className="btn-primary-red w-100 py-3 fw-bold"
                        onClick={() => handleDownload(movie)}
                        disabled={downloadingId === movie.id}
                       >
                         {downloadingId === movie.id 
                           ? <><Spinner animation="border" size="sm" className="me-2" /> PROCESSING...</>
                           : hasDownloaded 
                             ? <><i className="bi bi-arrow-repeat me-2 fs-5"></i> DOWNLOAD AGAIN</>
                             : <><i className="bi bi-download me-2 fs-5"></i> DOWNLOAD NOW</>
                         }
                       </Button>
                       {movie.size && <span className="small text-white opacity-75 text-center mt-2 fw-bold text-uppercase" style={{letterSpacing: '1px'}}>{movie.size}</span>}
                    </div>
                    {hasDownloaded && (
                      <div className="downloaded-badge" style={{background: 'var(--primary)'}}>
                        <i className="bi bi-check-circle-fill me-1"></i> SAVED
                      </div>
                    )}
                  </div>
                  <Card.Body className="px-3 pt-3 pb-4">
                    <Card.Title className="fs-6 fw-bold mb-2 text-truncate" style={{ color: 'var(--text-primary)' }}>
                      {movie.title}
                    </Card.Title>
                    <div className="d-flex justify-content-between align-items-center small mt-1">
                      <span className="text-uppercase tracking-wider fw-bold" style={{ color: 'var(--primary)', fontSize: '0.7rem' }}>
                        {movie.category}
                      </span>
                      <span className="fw-bold opacity-75 px-2 py-1 rounded bg-secondary-subtle" style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>
                        2026
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {filteredMovies.length === 0 && !loading && (
          <div className="text-center py-5 glass-card my-5 rounded-4 border-dashed">
            <i className="bi bi-search display-1 text-muted opacity-25 mb-4 d-block"></i>
            <h4 className="fw-bold text-secondary">No movies found</h4>
            <p className="text-muted mb-4 px-3">We couldn't find any results for "{searchQuery}". Check the spelling or try again.</p>
            <Button variant="danger" className="btn-primary-red px-4" onClick={() => setSearchQuery('')}>
              Reset Library Search
            </Button>
          </div>
        )}

        <Modal 
          show={showPlayer} 
          onHide={() => setShowPlayer(false)}
          size="xl"
          centered
          className="movie-player-modal"
          contentClassName="bg-dark border-0 overflow-hidden"
        >
          <Modal.Header closeButton closeVariant="white" className="border-0 pb-0 bg-dark">
            <Modal.Title className="text-white fs-5 fw-bold">
              <i className="bi bi-film me-2 text-primary"></i>
              {selectedMovie?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0 bg-dark">
            {selectedMovie && (
              <video 
                key={selectedMovie.id}
                controls 
                autoPlay 
                className="w-100"
                style={{ maxHeight: '80vh', backgroundColor: '#000' }}
                controlsList="nodownload"
                src={selectedMovie.streamUrl}
              >
                Your browser does not support the video tag.
              </video>
            )}
            <div className="p-4 text-center bg-black">
               <p className="text-muted small m-0 fw-medium">
                 <i className="bi bi-shield-fill-check me-2 text-primary"></i>
                 Encrypted Streaming Active — Content served directly from private Drive Vault via Proxy
               </p>
            </div>
          </Modal.Body>
        </Modal>

        <AdGateModal
          show={showAdGate}
          onHide={() => {
            if (downloadingId) return;
            setShowAdGate(false);
            setPendingDownloadMovie(null);
          }}
          onComplete={completeAdAndDownload}
          movieTitle={pendingDownloadMovie?.title}
        />
      </Container>
    </section>
  );
};

export default ShowsGrid;
