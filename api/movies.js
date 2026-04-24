import { google } from 'googleapis';

export default async function handler(req, res) {
  const API_KEY = process.env.VITE_GOOGLE_DRIVE_API_KEY;
  const FOLDER_ID = process.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return res.status(500).json({ error: 'Google Drive API Key is not configured.' });
  }

  if (!FOLDER_ID) {
    return res.status(500).json({ error: 'Google Drive Folder ID is not configured.' });
  }

  try {
    const drive = google.drive({ version: 'v3', auth: API_KEY });
    const folderIds = FOLDER_ID.split(',').map(id => id.trim());
    
    const allResponses = await Promise.all(folderIds.map(folderId => 
      drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, thumbnailLink, size)',
        pageSize: 1000
      })
    ));

    const allFiles = allResponses.flatMap(response => response.data.files || []);

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

    console.log(`[SCAN] Found ${videoFiles.length} videos and ${imageFiles.length} images.`);

    // 2. Map videos to their matching images
    const movies = videoFiles.map(file => {
      const baseName = file.name.replace(/\.[^/.]+$/, ""); // Name without extension
      
      // Look for an image with the exact same base name
      const matchingImgFile = imageFiles.find(img => {
        const imgBaseName = img.name.replace(/\.[^/.]+$/, "");
        return imgBaseName.toLowerCase().trim() === baseName.toLowerCase().trim();
      });

      let movieImage = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';
      
      if (matchingImgFile) {
        console.log(`[MATCH] Video: "${file.name}" -> Poster: "${matchingImgFile.name}"`);
        movieImage = `/api/image?id=${matchingImgFile.id}`;
      } else if (file.thumbnailLink) {
        movieImage = file.thumbnailLink.replace('=s220', '=s800');
      }

      return {
        id: file.id,
        title: baseName,
        image: movieImage,
        size: file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Size N/A',
        category: 'Action', 
        year: '2026', 
        downloadUrl: `/api/download?id=${file.id}`,
        streamUrl: `/api/stream?id=${file.id}`
      };
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
