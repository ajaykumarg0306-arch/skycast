# SkyCast - Weather Report Web App

SkyCast is a modern, full-stack weather intelligence web app built with React, Vite, Tailwind CSS, and a Node.js/Express backend API layer. It delivers real-time meteorological conditions, 24-hour hourly trends with interactive Recharts graphs, a 7-day outlook, and AI-powered weather insights via Google Gemini.

## Features

- **Full-Stack Architecture**: Node.js/Express server proxies all Open-Meteo API requests (forecast + geocoding) with 10-minute in-memory caching and error sanitization.
- **Debounced Geocoding Autocomplete**: Search cities worldwide with keyboard navigation and instant suggestions.
- **Geolocation Support**: One-click "My Location" browser GPS detection with fallback handling.
- **Hero Condition Card**: Current temperature, feels-like, today's high/low, atmospheric condition icon, local time, and quick refresh.
- **8-Metric Atmospheric Grid**: Humidity, wind speed/direction, barometric pressure, UV index (with safety tier), visibility, precipitation, sunrise, and sunset.
- **24-Hour Forecast Strip & Recharts Graph**: Horizontally scrollable hour-by-hour strip plus a responsive temperature/rain probability area chart.
- **7-Day Outlook**: Daily forecasts with precipitation probability and relative min/max temperature visual range bars.
- **°C / °F & Theme Toggles**: Session-persisted metric/imperial toggle and system-aware dark/light theme.
- **Favorites & Search History**: Save favorite locations and review recent searches (persisted in `localStorage`).
- **Dynamic Atmosphere**: Reactive background gradients and styling that shift based on condition (sunny, rainy, thunderstorm, snow, fog) and day/night state.
- **Gemini AI Weather Insights**: Lifestyle suggestions, what to wear, outdoor activity advice, and atmospheric advisories.

## Architecture & API Endpoints

- `GET /api/geocode?q={city}`: Searches matching places (name, country, region, latitude, longitude).
- `GET /api/weather?lat={lat}&lon={lon}&units={metric|imperial}`: Returns normalized current, hourly, and daily weather.
- `POST /api/weather/insights`: Calls Gemini API to generate weather advice and lifestyle takeaways.
- `GET /api/health`: Health status check.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs Express with Vite middlewares on port 3000):
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

## Deployment

The app is packaged as a single deployable service:
- Build step: `npm run build`
- Start step: `npm start` (which runs `NODE_ENV=production tsx server.ts` and serves the built static frontend from `dist/` on `PORT`)
