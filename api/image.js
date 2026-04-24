import { google } from 'googleapis';

export default async function handler(req, res) {
  const { id } = req.query;
  const API_KEY = process.env.VITE_GOOGLE_DRIVE_API_KEY;

  if (!id) return res.status(400).send('Image ID is required');

  try {
    const drive = google.drive({ version: 'v3', auth: API_KEY });

    // Fetch the image content
    const response = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' }
    );

    // Forward the content type if possible, or default to image/jpeg
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    response.data.pipe(res);
  } catch (error) {
    console.error('Image Proxy Error:', error);
    res.status(500).send('Error loading image');
  }
}
