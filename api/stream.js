import { google } from 'googleapis';

export default async function handler(req, res) {
  const { id } = req.query;
  const API_KEY = process.env.VITE_GOOGLE_DRIVE_API_KEY;

  if (!id) return res.status(400).send('File ID is required');

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return res.status(500).send('Google Drive API Key is not configured. Please add your real API Key to the .env file.');
  }

  try {
    const drive = google.drive({ version: 'v3', auth: API_KEY });

    // 1. Get initial metadata to check if it's a shortcut
    let fileMetadata = await drive.files.get({
      fileId: id,
      fields: 'id, name, mimeType, webContentLink, shortcutDetails'
    });

    let targetId = id;

    // 2. If it's a shortcut, resolve the actual file ID
    if (fileMetadata.data.mimeType === 'application/vnd.google-apps.shortcut' && fileMetadata.data.shortcutDetails) {
      targetId = fileMetadata.data.shortcutDetails.targetId;
      console.log(`[RESOLVE] Shortcut "${fileMetadata.data.name}" -> Original ID: ${targetId}`);
      
      // Fetch metadata for the actual file
      fileMetadata = await drive.files.get({
        fileId: targetId,
        fields: 'id, name, mimeType, webContentLink'
      });
    }

    const streamUrl = fileMetadata.data.webContentLink;

    if (!streamUrl) {
      throw new Error(`Google Drive did not provide a download link for "${fileMetadata.data.name}". Ensure the file is shared as "Anyone with the link can view".`);
    }

    /**
     * VERCEL STABILITY LOGIC:
     * Redirect to the direct Google Drive stream link.
     */
    res.writeHead(302, {
      'Location': streamUrl,
      'Content-Type': fileMetadata.data.mimeType || 'video/mp4',
    });
    res.end();

  } catch (error) {
    console.error('Streaming Error:', error.message);
    res.status(500).json({ 
      error: 'Streaming Failed', 
      details: error.message,
      suggestion: 'Check if the file is shared publicly in Google Drive.'
    });
  }
}
