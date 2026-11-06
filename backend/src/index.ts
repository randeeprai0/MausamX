import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration allowing requests from Vite frontend dev server or production origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API router under /api
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    app: 'Mausam X Backend API',
    description: 'Weather Proxy & Meteorological Intelligence API Server',
    status: 'online',
    endpoints: [
      '/api/health',
      '/api/alerts?lat={lat}&lon={lon}',
      '/api/search?name={query}',
      '/api/weather?latitude={lat}&longitude={lon}',
      '/api/air-quality?latitude={lat}&longitude={lon}',
      '/api/curated-cities'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[Mausam X Backend] Server running at http://localhost:${PORT}`);
});

