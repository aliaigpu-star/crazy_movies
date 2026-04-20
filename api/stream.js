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

    // 1. Get file metadata (we need the total size for seeking)
    const fileMetadata = await drive.files.get({
      fileId: id,
      fields: 'size, mimeType'
    });
    const totalSize = parseInt(fileMetadata.data.size);

    // 2. Handle Range Header from browser
    const range = req.headers.range;
    let driveRequestOptions = { fileId: id, alt: 'media' };
    let status = 200;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunksize = (end - start) + 1;

      console.log(`Seeking Movie ID ${id}: ${start}-${end}/${totalSize}`);

      status = 206; // Partial Content
      res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
      res.setHeader('Content-Length', chunksize);
      
      // Tell Google Drive which bytes we want
      driveRequestOptions.headers = { Range: `bytes=${start}-${end}` };
    } else {
      res.setHeader('Content-Length', totalSize);
    }

    // 3. Set standard video headers
    res.setHeader('Content-Type', fileMetadata.data.mimeType || 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.status(status);

    // 4. Stream the specific range from Google
    const response = await drive.files.get(
      driveRequestOptions,
      { responseType: 'stream' }
    );

    response.data
      .on('error', err => {
        console.error('Stream Pipe Error:', err);
        if (!res.headersSent) res.status(500).end();
      })
      .pipe(res);

  } catch (error) {
    console.error('Seeking Proxy Error:', error);
    if (!res.headersSent) res.status(500).send('Unable to seek in stream');
  }
}
