# 🌦️ Mausam X – Smart Weather Experience

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-success.svg?logo=vitest)](https://vitest.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-IndexedDB%20Offline-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**Mausam X** is a commercial-grade, intelligent weather and atmospheric intelligence platform built with React, TypeScript, Tailwind CSS, TanStack Query, Recharts, and Leaflet. Engineered as a high-performance progressive web app (PWA), Mausam X delivers real-time meteorological conditions, 24-hour granular outlooks, 7-day synoptic forecasts, multi-scale air quality indexes (EU & US EPA), live Doppler precipitation radar, solar transit arcs, contextual attire advice, and offline snapshots via IndexedDB.

---

## 📸 Visual Design & UX Philosophy

Mausam X eschews generic admin templates in favor of a bespoke **modern glassmorphism** aesthetic inspired by premium consumer weather applications:

- **Dynamic Weather Theming**: The interface dynamically adapts ambient atmospheric gradients, particle animations (subtle rain streaks, lightning pulses, solar glows), and color accents according to real-time weather codes and daytime/nighttime status.
- **Glassmorphic Depth**: Multi-layer backdrop blurs (`backdrop-blur-xl`), translucent dark card surfaces (`rgba(15, 23, 42, 0.75)`), subtle borders (`rgba(255, 255, 255, 0.08)`), and glowing accents.
- **Micro-Interactions & Motion**: Fluid Framer Motion transitions, temperature state transitions, and compliance with the `prefers-reduced-motion` accessibility media query.
- **Responsive Architecture**: Engineered mobile-first with horizontal forecast carousels, touch-optimized cards, and grid reorganization for desktop and tablet screens.

---

## 🌟 Key Features

### 1. Primary Dashboard & Real-Time Weather
- **Hero Weather Card**: Live temperature, feels-like index, diurnal min/max span, WMO condition description, animated condition icon, and favorite toggle.
- **Ephemeris & Solar Transit Arc**: Real-time celestial trajectory tracking showing sunrise, sunset, daylight duration, and solar progress percentage.
- **8-Parameter Sensor Telemetry**: Humidity, wind velocity and gusts, 360° rotating azimuth compass, barometric pressure with system classification, visibility depth, UV index with danger bands, cloud coverage, and dew point.

### 2. 24-Hour Horizon & 7-Day Forecast
- **Hourly Forecast**: 24-hour horizontal scrolling timeline with current-hour highlighting, hourly temperatures, precipitation probabilities, and normalized trend indicators.
- **7-Day Synoptic Outlook**: Comprehensive week-ahead forecast featuring day names, conditions, precipitation probability badges, and relative min/max temperature range sliders.

### 3. Air Quality Telemetry (Open-Meteo Air Quality API)
- **Dual AQI Gauge**: Switch seamlessly between **European AQI (0–100+)** and **US EPA AQI (0–500)** standards.
- **Health Advisories**: Understandable qualitative risk indicators (*Good*, *Moderate*, *Unhealthy for Sensitive Groups*, *Unhealthy*, *Very Unhealthy*, *Hazardous*), tailored protective advice, and clear non-medical disclaimers.
- **Chemical Sensor Breakdown**: Individual metric cards for $PM_{2.5}$, $PM_{10}$, Carbon Monoxide ($CO$), Nitrogen Dioxide ($NO_2$), Surface Ozone ($O_3$), and Sulphur Dioxide ($SO_2$) with WHO target limit comparisons.

### 4. Interactive Data Visualizations (Recharts)
- **Tabbed Interactive Analytics**:
  1. *24-Hour Temperature Area Chart*: Smooth gradient line chart with responsive grid lines.
  2. *Precipitation Probability Bar Chart*: Hourly rain likelihood with percentage gauges.
  3. *Wind Velocity & Gusts Line Chart*: Real-time wind speed telemetry in km/h or mph.
  4. *Weekly Temperature Range Chart*: Side-by-side comparative min/max daily variance.
- **Glassmorphic Custom Tooltips**: Floating data cards with customized units and high contrast.

### 5. Geospatial Radar & Interactive Map (Leaflet & RainViewer)
- **Interactive Weather Map**: Centered on selected city coordinates with custom map markers and info popups.
- **Real Doppler Radar**: Live precipitation radar layer powered by the RainViewer Global Tile API with reflectivity legend from light rain to severe squalls.
- **Base Layer Selector**: Toggle between sleek CartoDB Dark map tiles and OpenStreetMap Street view.

### 6. Smart Rule-Based Weather Insights
- Contextual intelligence generated strictly from verified forecast data:
  - Immediate rain warnings (e.g. *"Elevated rain chance starting around 3:00 PM"*).
  - Diurnal temperature shifts (e.g. *"Tomorrow's peak will be 4° warmer than today"*).
  - High wind and gust alerts.
  - Midday peak UV radiation warnings with sunscreen advice.

### 7. Lifestyle & Outdoor Activity Optimizers
- **Weather-Adaptive Clothing Guide**: Dynamic outerwear, layering, footwear, and accessory suggestions (parkas, light pullovers, umbrellas, UV400 sunglasses, water-resistant footwear).
- **Best Time to Go Outside**: Multi-factor scoring algorithm (0–100) evaluating daytime temperature, precipitation probability, wind, and UV to identify optimal hours for running, cycling, and walking.

### 8. Multi-City Management & Comparison
- **Saved Cities**: Add/remove bookmarked cities with persistent storage in LocalStorage.
- **Side-by-Side Comparison**: Compare coordinates, timezones, and climate conditions of up to 3 cities simultaneously.
- **Global Autocomplete Search**: Debounced worldwide geocoding with Arrow key navigation, country flags, and recent searches memory.

### 9. Progressive Web App (PWA) & Offline Snapshot
- **Offline Snapshot Support**: Saves the latest weather telemetry to **IndexedDB** (`idb-keyval`) with timestamping.
- **Offline Mode Indicator**: Sticky alert banner informing users when displaying cached snapshot data.
- **Full PWA Manifest & Service Worker**: Installable on Android, iOS, Windows, and macOS with standalone display and cached static assets.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite 6 |
| **Styling & Design System** | Tailwind CSS 3, Custom Glassmorphism, CSS Variables |
| **Data Synchronization** | TanStack Query v5 (React Query) |
| **Animations & Icons** | Framer Motion 12, Lucide React |
| **Charts & Maps** | Recharts, Leaflet, React-Leaflet, RainViewer Doppler API |
| **Persistence & PWA** | LocalStorage, IndexedDB (`idb-keyval`), Vite PWA Plugin |
| **Backend & Proxy** | Node.js, Express, TypeScript, Axios, CORS |
| **Unit & Integration Testing** | Vitest, React Testing Library, JSDOM |
| **Deployment Target** | Vercel |

---

## 📂 Project Architecture

```
MausamX/
├── frontend/                   # React + TypeScript + Vite Frontend Application
│   ├── public/
│   │   ├── icons/              # PWA App Icons (192x192, 512x512)
│   │   ├── apple-touch-icon.png
│   │   └── favicon.svg         # SVG Brand Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── air-quality/    # AirQualityCard, AirQualityDetails
│   │   │   ├── charts/         # InteractiveCharts (Recharts tabs)
│   │   │   ├── common/         # SearchBar, LoadingSkeleton, ErrorState, UnitToggle, ThemeToggle, OfflineBanner
│   │   │   ├── insights/       # WeatherInsights, ClothingRecommendations, OutdoorActivity
│   │   │   ├── layout/         # Header, Footer
│   │   │   ├── maps/           # WeatherMap (Leaflet + RainViewer Radar)
│   │   │   ├── modals/         # FavoritesModal (City Management & Comparison), SettingsModal
│   │   │   └── weather/        # CurrentWeather, HourlyForecast, WeeklyForecast, WeatherDetails, SunriseSunset, WeatherAlerts
│   │   ├── context/
│   │   │   ├── SettingsContext.tsx # User units, theme mode, refresh rates
│   │   │   └── WeatherContext.tsx  # Global location, query state, offline snapshot
│   │   ├── services/
│   │   │   ├── airQualityApi.ts    # Open-Meteo Air Quality integration
│   │   │   ├── alertApi.ts         # Severe weather alert engine
│   │   │   ├── geocodingApi.ts     # Open-Meteo Search & Reverse Geocode
│   │   │   ├── offlineStorage.ts   # IndexedDB & LocalStorage adapters
│   │   │   └── weatherApi.ts       # Open-Meteo Weather Forecast integration
│   │   ├── types/
│   │   │   ├── airQuality.ts
│   │   │   ├── location.ts
│   │   │   ├── settings.ts
│   │   │   └── weather.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts       # Units conversion & celestial calculations
│   │   │   ├── recommendations.ts  # Clothing & outdoor comfort scoring algorithms
│   │   │   ├── weatherConditions.ts# WMO codes mapping to gradients & themes
│   │   │   └── weatherInsights.ts  # Deterministic rule synthesizer
│   │   ├── __tests__/              # Vitest Test Suites (32 tests passing)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                    # Node.js + Express Backend Proxy & Alert Engine
│   ├── src/
│   │   ├── routes/
│   │   │   └── api.ts          # /api/weather, /api/search, /api/alerts, /api/health
│   │   ├── services/
│   │   │   └── alertService.ts # Weather alert provider integration
│   │   ├── index.ts
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json                # Root orchestration package.json
├── vercel.json                 # Production deployment configuration for Vercel
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Installation

Clone the repository and install dependencies across all workspaces:

```bash
# 1. Install root, frontend, and backend packages
npm install
npm --prefix frontend install
npm --prefix backend install
```

---

## 💻 Development Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Launch the frontend Vite development server on `http://localhost:5173` |
| `npm run dev:backend` | Launch the backend Express TypeScript server on `http://localhost:3001` |
| `npm run dev:all` | Concurrently start **both** backend and frontend dev servers |
| `npm run build` | Perform TypeScript type check and compile production frontend bundle |
| `npm run build:backend` | Compile backend TypeScript into `dist/` |
| `npm test` | Run the Vitest unit test suite (32 unit tests) |

---

## 📡 API Integrations & Attribution

Mausam X relies exclusively on verified, open-access meteorological providers:

1. **Weather Forecast**: [Open-Meteo Weather API](https://open-meteo.com/en/docs)
   - Real-time temperatures, apparent temperatures, hourly intervals, precipitation, wind speed, UV index, and sunrise/sunset ephemeris.
   - Non-commercial and open data attribution under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
2. **Worldwide Geocoding**: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
   - Fast worldwide city search, geographic administrative regions, and coordinates.
3. **Air Quality Monitoring**: [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
   - European AQI, US EPA AQI, and detailed particulate chemistry ($PM_{2.5}, PM_{10}, NO_2, SO_2, CO, O_3$).
4. **Doppler Radar Tiles**: [RainViewer](https://www.rainviewer.com/api.html)
   - Live weather radar imagery and precipitation reflectivity map layers.
5. **Basemaps**: [OpenStreetMap](https://www.openstreetmap.org/copyright) & [CARTO](https://carto.com/).

---

## 🧪 Testing Suite

Mausam X includes a test suite using **Vitest** and **React Testing Library**:

```bash
npm test
```

### Verified Test Suites:
- `formatters.test.ts`: Celsius/Fahrenheit conversions, wind speed conversions (km/h, mph, m/s, kn), barometric pressure (hPa, inHg, mmHg), 16-point cardinal wind directions, UV safety levels, European AQI, US EPA AQI, and solar progress percentages.
- `weatherConditions.test.ts`: WMO code mapping, dynamic theme classification, daytime vs nighttime asset resolution, and fallback safety.
- `weatherInsights.test.ts`: Deterministic rain anticipation in next 12 hours, day-over-day temperature shift detection, and midday peak UV warnings.
- `recommendations.test.ts`: Clothing selection logic across temperature bands, precipitation gear recommendations, and diurnal outdoor activity comfort scores.

---

## ☁️ Deployment Instructions (Vercel)

The application is pre-configured for one-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Select **Vite** as the framework preset (or let `vercel.json` automatically configure root build settings).
4. Configure build settings:
   - **Build Command**: `npm --prefix frontend run build`
   - **Output Directory**: `frontend/dist`
5. Click **Deploy**.

---

## 🔮 Future Roadmap
- Historical weather archive comparison (analyzing climate variance over past decades).
- Push notifications via Web Push API for sudden severe weather alerts.
- Multi-language localization (i18n) for international markets.

---

## 📄 License
This project is licensed under the MIT License. Meteorological telemetry provided by Open-Meteo under CC BY 4.0.

