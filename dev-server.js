import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import { createServer as createViteServer } from 'vite';

import moviesHandler from './api/movies.js';
import streamHandler from './api/stream.js';
import downloadHandler from './api/download.js';
import gateHandler from './api/gate.js';

const port = Number(process.env.PORT || 5173);

const app = express();

// API routes (Express-style wrapper around Vercel-style handlers)
app.all('/api/movies', (req, res) => moviesHandler(req, res));
app.all('/api/stream', (req, res) => streamHandler(req, res));
app.all('/api/download', (req, res) => downloadHandler(req, res));
app.all('/api/gate', (req, res) => gateHandler(req, res));

// Vite dev middleware for React app + HMR
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});
app.use(vite.middlewares);

const server = http.createServer(app);
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Dev server running at http://localhost:${port}`);
});

