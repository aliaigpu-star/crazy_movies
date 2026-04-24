const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const FOLDER_ID = '1CQGHK8MoazGzPhhz-gw9JKR4bujhK1-h';

/**
 * Validates if a movie has been downloaded already (persistent record).
 * @param {string} fileId 
 * @returns {boolean}
 */
export const isDownloaded = (fileId) => {
  const downloaded = JSON.parse(localStorage.getItem('downloaded_movies') || '[]');
  return downloaded.includes(fileId);
};

/**
 * Records a download in localStorage (persistent badge).
 * @param {string} fileId 
 */
export const markAsDownloaded = (fileId) => {
  const downloaded = JSON.parse(localStorage.getItem('downloaded_movies') || '[]');
  if (!downloaded.includes(fileId)) {
    downloaded.push(fileId);
    localStorage.setItem('downloaded_movies', JSON.stringify(downloaded));
  }
};

/**
 * ── ONE-TIME DOWNLOAD SESSION ──
 * 
 * Stores the active download session in sessionStorage.
 * A session = { fileId, token, nonce, createdAt }
 * 
 * sessionStorage is cleared on tab close / refresh,
 * which naturally enforces "one chance per click".
 */

/** Check if there's an active (unused) download session for this file */
export const getActiveDownloadSession = (fileId) => {
  try {
    const raw = sessionStorage.getItem(`dl_session_${fileId}`);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Check if session is still within 5 minute window
    if (Date.now() - session.createdAt > 5 * 60 * 1000) {
      sessionStorage.removeItem(`dl_session_${fileId}`);
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

/** Save a new download session */
export const saveDownloadSession = (fileId, token, nonce) => {
  sessionStorage.setItem(`dl_session_${fileId}`, JSON.stringify({
    fileId,
    token,
    nonce,
    createdAt: Date.now(),
  }));
};

/** Mark session as consumed (download started) */
export const consumeDownloadSession = (fileId) => {
  sessionStorage.removeItem(`dl_session_${fileId}`);
};

/**
 * Fetches the list of movies from our Secure Vercel API.
 */
export const fetchMoviesFromDrive = async () => {
  // If no API Key is set, return demo movies immediately to avoid console errors
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return { movies: getMockMovies(), isDemo: true };
  }

  try {
    const response = await fetch('/api/movies');
    if (!response.ok) {
      throw new Error('Failed to fetch from Vault');
    }
    const data = await response.json();
    return { movies: data, isDemo: false };
  } catch (error) {
    console.warn('Backend API error, falling back to Demo Mode');
    return { movies: getMockMovies(), isDemo: true };
  }
};

const getMockMovies = () => [
  { 
    id: 'm1', 
    title: 'The Raja Saab', 
    image: 'https://cdn.filmibeat.com/ph/2024/01/the-raja-saab_170530739910.jpg', 
    category: 'Action', 
    year: '2026', 
    size: '1.8 GB',
    streamUrl: '/api/stream?id=mock1',
    downloadUrl: '/api/download?id=mock1'
  },
  { 
    id: 'm2', 
    title: 'Pushpa 2: The Rule', 
    image: 'https://images.firstpost.com/uploads/2024/04/Pushpa-2-The-Rule-teaser.jpg', 
    category: 'Action', 
    year: '2024', 
    size: '2.2 GB',
    streamUrl: '/api/stream?id=mock2',
    downloadUrl: '/api/download?id=mock2'
  },
  { 
    id: 'm3', 
    title: 'Singham Again', 
    image: 'https://m.media-amazon.com/images/M/MV5BMjA4MDY5MjYtZGYyZi00MzllLThlMGUtYmU0MGYzMDUyYmU1XkEyXkFqcGc@._V1_.jpg', 
    category: 'Action', 
    year: '2024', 
    size: '1.5 GB',
    streamUrl: '/api/stream?id=mock3',
    downloadUrl: '/api/download?id=mock3'
  },
  { 
    id: 'm4', 
    title: 'Munjya', 
    image: 'https://m.media-amazon.com/images/M/MV5BN2YwYjFhMTAtN2I5Mi00YmY0LWE2NGYtYmE0YzFkYjQ3YzgxXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_.jpg', 
    category: 'Horror', 
    year: '2024', 
    size: '950 MB',
    streamUrl: '/api/stream?id=mock4',
    downloadUrl: '/api/download?id=mock4'
  },
  { 
    id: 'm5', 
    title: 'Bhooth Bangla', 
    image: 'https://m.media-amazon.com/images/M/MV5BNzU1N2U3Y2UtZDYzMy00ZDRhLTliZjktZmE4ZjYxYmU5ZjE4XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg', 
    category: 'Comedy', 
    year: '2026', 
    size: '1.4 GB',
    streamUrl: '/api/stream?id=mock5',
    downloadUrl: '/api/download?id=mock5'
  }
];
