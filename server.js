import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import moviesHandler from './api/movies.js';
import streamHandler from './api/stream.js';
import downloadHandler from './api/download.js';
import gateHandler from './api/gate.js';
import imageHandler from './api/image.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/movies', (req, res) => moviesHandler(req, res));
app.get('/api/stream', (req, res) => streamHandler(req, res));
app.get('/api/download', (req, res) => downloadHandler(req, res));
app.all('/api/gate', (req, res) => gateHandler(req, res));
app.get('/api/image', (req, res) => imageHandler(req, res));

app.listen(port, '0.0.0.0', () => {
  console.log(`Production API server running on port ${port}`);
});
