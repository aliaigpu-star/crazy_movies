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

    // 1. Get the file metadata to find the real Google Drive direct link
    const file = await drive.files.get({
      fileId: id,
      fields: 'webContentLink, mimeType'
    });

    const streamUrl = file.data.webContentLink;

    if (!streamUrl) {
      throw new Error('Could not generate stream link');
    }

    /**
     * VERCEL STABILITY LOGIC:
     * Instead of streaming through the server (which timeouts after 10s), 
     * we use a 302 Redirect to Google Drive.
     * This keeps the stream stable, supports seeking, and uses 0 Vercel bandwidth.
     */
    res.writeHead(302, {
      'Location': streamUrl,
      'Content-Type': file.data.mimeType || 'video/mp4',
    });
    res.end();

  } catch (error) {
    console.error('Streaming Error:', error);
    res.status(500).send('Unable to start stream. Please try again later.');
  }
}
