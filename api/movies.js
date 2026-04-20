import { google } from 'googleapis';

export default async function handler(req, res) {
  const API_KEY = process.env.VITE_GOOGLE_DRIVE_API_KEY;
  const FOLDER_ID = process.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return res.status(500).json({ error: 'Google Drive API Key is not configured. Please add your real API Key to the .env file.' });
  }

  if (!FOLDER_ID) {
    return res.status(500).json({ error: 'Google Drive Folder ID is not configured.' });
  }

  try {
    const drive = google.drive({ version: 'v3', auth: API_KEY });
    
    // Support multiple folder IDs separated by commas
    const folderIds = FOLDER_ID.split(',').map(id => id.trim());
    
    const allResponses = await Promise.all(folderIds.map(folderId => 
      drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, thumbnailLink, size)',
      })
    ));

    const allFiles = allResponses.flatMap(response => response.data.files || []);

    // DEBUG: Log every file found to see what's actually in there
    console.log('--- SCANNING DRIVE ---');
    allFiles.forEach(f => console.log(`Found: "${f.name}" | Type: ${f.mimeType}`));
    console.log('----------------------');

    const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'];

    const movies = allFiles
      .filter(file => {
        const isVideoMime = file.mimeType.startsWith('video/');
        const isVideoExt = videoExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
        const isShortcut = file.mimeType === 'application/vnd.google-apps.shortcut';
        return isVideoMime || isVideoExt || isShortcut;
      })
      .map(file => ({
        id: file.id,
        title: file.name.replace(/\.[^/.]+$/, ""),
        image: file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s800') : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
        size: file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown size',
        category: 'Action', 
        year: '2024',
        downloadUrl: `/api/download?id=${file.id}`,
        streamUrl: `/api/stream?id=${file.id}`
      }));

    console.log(`Successfully identified ${movies.length} movies.`);
    return res.status(200).json(movies);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
