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
        fields: 'files(id, name, mimeType, thumbnailLink, size, webContentLink)',
        pageSize: 1000
      })
    ));

    const allFiles = allResponses.flatMap(response => response.data.files || []);

    console.log('--- SCANNING DRIVE ---');
    console.log(`Found ${allFiles.length} total files across folders.`);

    const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    // 1. Separate images and videos
    const imageFiles = allFiles.filter(file => 
      file.mimeType.startsWith('image/') || 
      imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    const videoFiles = allFiles.filter(file => {
      const isVideoMime = file.mimeType.startsWith('video/');
      const isVideoExt = videoExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      const isShortcut = file.mimeType === 'application/vnd.google-apps.shortcut';
      return isVideoMime || isVideoExt || isShortcut;
    });

    // 2. Map videos to their matching images
    const movies = videoFiles.map(file => {
      const baseName = file.name.replace(/\.[^/.]+$/, ""); // Name without extension
      
      // Look for an image with the exact same base name
      const matchingImage = imageFiles.find(img => {
        const imgBaseName = img.name.replace(/\.[^/.]+$/, "");
        return imgBaseName.toLowerCase() === baseName.toLowerCase();
      });

      // Use the matching image's webContentLink for the actual picture,
      // fallback to thumbnail, fallback to placeholder.
      let movieImage = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';
      
      if (matchingImage) {
        // Construct a direct image link from the file ID
        movieImage = `https://lh3.googleusercontent.com/u/0/d/${matchingImage.id}`;
      } else if (file.thumbnailLink) {
        movieImage = file.thumbnailLink.replace('=s220', '=s800');
      }

      return {
        id: file.id,
        title: baseName,
        image: movieImage,
        size: file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown size',
        category: 'Action', 
        year: '2026', 
        downloadUrl: `/api/download?id=${file.id}`,
        streamUrl: `/api/stream?id=${file.id}`
      };
    });

    console.log(`Successfully matched ${movies.length} movies with thumbnails where available.`);
    return res.status(200).json(movies);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
