import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { searchGeocode, getWeatherData } from './server/weatherService';
import { generateWeatherInsights } from './server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API: Geocode location search
app.get('/api/geocode', async (req: Request, res: Response) => {
  try {
    const q = req.query.q;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.status(400).json({ error: 'Query parameter "q" is required and cannot be empty.' });
      return;
    }

    const places = await searchGeocode(q.trim());
    res.json(places);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown geocoding error';
    console.error('Geocode API Error:', message);
    res.status(502).json({ error: 'Unable to reach geocoding service. Please try again.' });
  }
});

// API: Weather forecast
app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    const latStr = req.query.lat;
    const lonStr = req.query.lon;
    const unitsStr = req.query.units;
    const name = typeof req.query.name === 'string' ? req.query.name : undefined;
    const region = typeof req.query.region === 'string' ? req.query.region : undefined;
    const country = typeof req.query.country === 'string' ? req.query.country : undefined;

    if (!latStr || !lonStr) {
      res.status(400).json({ error: 'Parameters "lat" and "lon" are required.' });
      return;
    }

    const lat = parseFloat(String(latStr));
    const lon = parseFloat(String(lonStr));

    if (isNaN(lat) || isNaN(lon)) {
      res.status(400).json({ error: 'Parameters "lat" and "lon" must be valid numbers.' });
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      res.status(400).json({ error: 'Latitude must be between -90 and 90, Longitude between -180 and 180.' });
      return;
    }

    const units = unitsStr === 'imperial' ? 'imperial' : 'metric';
    const weather = await getWeatherData(lat, lon, units, name, region, country);

    res.json(weather);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown weather service error';
    console.error('Weather API Error:', message);
    res.status(502).json({ error: 'Unable to retrieve weather data from provider. Please try again.' });
  }
});

// API: AI Weather Insights
app.post('/api/weather/insights', async (req: Request, res: Response) => {
  try {
    const weatherData = req.body;
    if (!weatherData || !weatherData.current || !weatherData.location) {
      res.status(400).json({ error: 'Valid weatherData payload is required.' });
      return;
    }

    const insights = await generateWeatherInsights(weatherData);
    res.json(insights);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown insights error';
    console.error('Insights API Error:', message);
    res.status(500).json({ error: 'Failed to generate weather insights.' });
  }
});

// Global API error handler
app.use('/api', (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Dev vs Production Vite Middleware Setup
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkyCast server running on port ${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
