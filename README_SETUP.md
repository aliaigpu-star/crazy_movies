# MovieBox — Secure Streaming & One-Time Download Portal

Your movies stay on Google Drive. Users can **watch online** (streaming) and **download** with a **one-time link** that expires on refresh.

## Features

### 🎬 Watch Online (Streaming)
- Movies stream directly from Google Drive through your server proxy (`/api/stream`)
- The actual Google Drive URL is **hidden** — users only see your domain
- Works on all browsers and mobile devices

### ⬇️ One-Time Download Logic
Here's how the download security works:

1. User clicks **"Download Now"** on a movie card
2. An **Ad Gate timer** (6 seconds) runs — you can put real ads here
3. After the timer, user clicks **"Continue to Download"**
4. Your server generates a **one-time use token** (valid for 5 minutes)
5. The download opens in a **new tab** using that token
6. The token is **consumed immediately** on the server
7. If the user **refreshes that download tab** or **shares the link**, they see:
   > 🔒 "Download Link Used — Please go back to the movie page and click Download again"

**Key point**: YES, you CAN download the full movie in one go. The download works perfectly for any file size (even 1GB+) because it uses a **302 redirect** to Google Drive — no timeout issues.

## Setup

### 1. Local Development
1. Create a `.env` file in the root:
   ```env
   VITE_GOOGLE_DRIVE_API_KEY=your_google_api_key
   VITE_GOOGLE_DRIVE_FOLDER_ID=your_folder_id
   DOWNLOAD_GATE_SECRET=change_me_to_a_long_random_secret
   ```
2. Run `npm run dev`
3. Open `http://localhost:5173`

### 2. Deploying to Vercel
In your Vercel Project Settings, add these environment variables:
- `VITE_GOOGLE_DRIVE_API_KEY` — Your Google Cloud API Key
- `VITE_GOOGLE_DRIVE_FOLDER_ID` — Your Google Drive folder ID
- `DOWNLOAD_GATE_SECRET` — A long random secret string for signing tokens

### 3. Google Drive Setup
1. Upload your movies to a Google Drive folder
2. Make the folder **"Anyone with the link"** can view
3. Copy the folder ID from the URL and put it in your `.env`
4. Get a Google Cloud API Key with Drive API enabled

## Security Benefits
- **No Direct Links**: Users never see the real Google Drive URL
- **One-Time Tokens**: Each download link works exactly ONCE
- **Link Sharing Blocked**: Shared links show an error page
- **Streaming Proxy**: Watch Online streams through your server
- **No Timeout Issues**: Uses 302 redirects, works for any file size

## How the One-Time Token Works
```
User clicks Download
       ↓
  [Ad Gate Timer - 6s]
       ↓
  POST /api/gate?id=xxx
       ↓
  Server creates token with:
    - fileId
    - expiry (5 min)
    - unique nonce
       ↓
  GET /api/download?id=xxx&token=yyy
       ↓
  Server verifies token:
    ✓ Valid signature?
    ✓ Not expired?
    ✓ Not already used? (nonce check)
       ↓
  If ALL pass → 302 redirect to Google Drive
  If ANY fail → Show "Go back to movie page" error
```
