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
    id: '1', 
    title: 'KGF Chapter 2', 
    image: 'https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg', 
    category: 'Action', 
    year: '2022', 
    size: '1.2 GB',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    downloadUrl: '/api/download?id=1'
  },
  { 
    id: '2', 
    title: 'Kalki 2898 AD', 
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD_poster.jpg', 
    category: 'Sci-Fi', 
    year: '2024', 
    size: '2.5 GB',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    downloadUrl: '/api/download?id=2'
  },
  { 
    id: '3', 
    title: 'Baahubali 2', 
    image: 'https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg', 
    category: 'Fantasy', 
    year: '2017', 
    size: '1.8 GB',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    downloadUrl: '/api/download?id=3'
  },
];
