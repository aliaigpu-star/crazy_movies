import { google } from 'googleapis';
import { verifyDownloadToken } from './gate.js';

/**
 * Returns a branded HTML error page instead of a plain text string.
 */
function errorPage(title, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} — MovieBox</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
         background:#080808;color:#fff;font-family:'Outfit','Inter',system-ui,sans-serif;padding:20px}
    .card{max-width:480px;width:100%;background:#121212;border-radius:16px;
          padding:40px;text-align:center;border:1px solid rgba(255,255,255,.08);
          box-shadow:0 20px 60px rgba(0,0,0,.5)}
    .icon{font-size:56px;margin-bottom:16px}
    h1{font-size:22px;margin-bottom:12px;color:#ff0b17}
    p{color:#a0a0a0;line-height:1.6;margin-bottom:24px;font-size:15px}
    a.btn{display:inline-block;padding:12px 32px;background:linear-gradient(45deg,#e50914,#ff2323);
          color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;
          transition:transform .2s,box-shadow .2s}
    a.btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(229,9,20,.4)}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a class="btn" href="/">← Go Back to Movies</a>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const { id, token } = req.query;
  const API_KEY = process.env.VITE_GOOGLE_DRIVE_API_KEY;
  const SECRET = process.env.DOWNLOAD_GATE_SECRET;

  if (!id) return res.status(400).send('File ID is required');

  // ── Token validation (one-time use) ──
  if (!token) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(403).send(errorPage(
      'Download Link Expired',
      'This download link is no longer valid. Please go back to the movie page and click "Download" again to get a fresh link.'
    ));
  }

  const result = verifyDownloadToken(token, SECRET);
  if (!result.ok) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(403).send(errorPage(
      'Download Link Used',
      result.error || 'This download link has already been used or has expired. Please go back to the movie page and request a new download.'
    ));
  }

  // Make sure the token's fileId matches the requested id
  if (result.payload.fileId !== String(id)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(403).send(errorPage(
      'Invalid Download Link',
      'This download link does not match the requested file. Please go back to the movie page and try again.'
    ));
  }

  try {
    const drive = google.drive({ version: 'v3', auth: API_KEY });

    // 1. Get the file metadata to find the real Google Drive download link
    const file = await drive.files.get({
      fileId: id,
      fields: 'webContentLink, name'
    });

    const downloadUrl = file.data.webContentLink;

    if (!downloadUrl) {
      throw new Error('Could not generate download link');
    }

    /**
     * VERCEL STABILITY LOGIC:
     * Instead of streaming (which timeouts after 10s), we use a 302 Redirect.
     * This keeps the download stable for large files while still 
     * hiding the link on your main website.
     */
    res.writeHead(302, {
      'Location': downloadUrl,
      'Content-Type': 'application/octet-stream',
    });
    res.end();

  } catch (error) {
    console.error('Download Error:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(errorPage(
      'Download Failed',
      'Something went wrong while preparing your download. Please go back to the movie page and try again.'
    ));
  }
}
