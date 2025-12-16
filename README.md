# Urban Air Quality Dashboard
![](https://raw.githubusercontent.com/nizoom/ignyte-aq-dashboard/master/readme_assets/Screenshot%202025-12-15%20at%2010.39.38%E2%80%AFAM.png)

> **Visualizing urban air pollution in three dimensions**

 Air quality can vary dramatically between street level and rooftops, yet most dashboards show flat 2D maps.
---

## What Makes This Different

Traditional air quality dashboards show a **flat 2D map** with color-coded dots. This dashboard leverages **3D positioning** to visualize the actual vertical distribution of sensors across urban environments (street level vs. rooftop installations) revealing pollution gradients that standard interfaces completely miss.

**Built for two audiences:**

- **Residents** – Quick health advisories and personal sensor data
- **Researchers** – Full sensor network access, battery diagnostics, and data export capabilities

---

## Quick Start

```bash
# Clone and navigate
git clone https://github.com/nizoom/ignyte-aq-dashboard.git
cd ignyte-aq-dashboard

# Backend setup (Python 3.11)
conda create -n aq_dashboard_env python=3.11
conda activate aq_dashboard_env
cd be-aq-dashboard
pip install fastapi uvicorn
uvicorn main:app --reload

# Frontend setup (separate terminal)
cd ../fe-aq-dashboard
npm install
npm run dev
```

**Then:** Configure your `.env` file (see [Environment Variables](#environment-variables))

**Access:**

- Frontend: http://localhost:5173
- API Docs: http://127.0.0.1:8000/docs

---

## System Architecture

```
┌──────────────────┐
│  Street Sensors  │ ← Low altitude
│  Rooftop Sensors │ ← High altitude
└────────┬─────────┘
         │ CSV Data
         ▼
┌─────────────────────────────────┐
│   FastAPI Backend               │
│   • Pydantic validation         │
│   • Time-series queries         │
│   • Battery diagnostics         │
└────────┬────────────────────────┘
         │ REST API
         ▼
┌─────────────────────────────────┐
│   React + TypeScript Frontend   │
│   • Mapbox 3D visualization     │
│   • Threebox (3D markers)       │
│   • Firebase auth               │
└─────────────────────────────────┘
```

**Key Design Decisions:**

- **Why 3D?** Vertical pollution gradients are scientifically significant but invisible in 2D
- **Why FastAPI?** Pydantic types catch data schema issues early; auto-generated API docs
- **Why Mapbox + Threebox?** Only combination supporting true 3D marker positioning by altitude

---

## Features

### Implemented

- **3D interactive map** with sensors positioned by actual altitude
- **Time-series data retrieval** (day/week/month/3-month ranges)
- **Battery diagnostics** tracking state-of-charge over time
- **Firebase authentication** with user management
- **Aggregated & individual sensor metadata** for network-wide and point-specific views
- **Type-safe API** with Pydantic models preventing data inconsistencies
- **Data export** – CSV/JSON download for researchers

### In Progress

- **AQI calculation refinement** – Converting raw voltage (mV) to ppb for EPA-standard AQI
  - Location: `fe-aq-dashboard/src/utils/aqi.ts` and `/be-aq-dashboard/services/sensor_service.py`
- **Data smoothing** – Implementing moving averages to show trends vs. noise spikes
  - Location: `be-aq-dashboard/routers/sensor.py:45` and `/be-aq-dashboard/services/sensor_service.py`
- **Sensor comparison UX** – Multi-sensor selection and side-by-side time-series

### Known Gaps

- **Production deployment** – Currently local-only
- **Role-based access control** – Backend enforcement for researcher vs. resident views
- **Live sensor ingestion** – Automated pipeline for real-time data updates
- **Mobile responsive design** – Optimized for desktop only

---

## For the Next Developer

- Graph overlays for multiple sensors
- Pollutant exposure over time
- Improve verticality visualization
- Sort sensors by number of active sensors, worst and best AQ
- Dominant pollutants in AQI. This is already part of the AQI response dictionary, it just needs to be visualized.
- Further partitioning of UX based on stakeholder type

### Code Hotspots

Files you'll modify most:

- `fe-aq-dashboard/src/components/map-componenents/map.tsx` – Map component initilization, building layer, stem layer, marker layer
- `be-aq-dashboard/services/sensor_service.py` – Core logic for formatting and organizing data
- `fe-aq-dashboard/src/utils/fetch_req.ts` – React data fetching layer
- `fe-aq-dashboard/src/utils/types.ts` – TypeScript type definitions
- `be-aq-dashboard/models/models.py` - Pydantic model definitions

---

## Project Structure

```
ignyte-aq-dashboard/
├── fe-aq-dashboard/           # Vite + React + TypeScript
│   ├── src/
│   │   ├── components/        # React components (Map3D, Charts, etc.)
│   │
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # date formatting, API Calls
│   │
│   └── .env                   # Environment variables (CREATE THIS)
│
├── be-aq-dashboard/           # FastAPI Python backend
│   ├── routers/
│   │   ├── sensors.py         # Sensor data endpoints
│   │   └── locations.py       # Location metadata endpoints
│   ├── models/
│   │   └── models.py          # Pydantic schemas
│   ├── services/
│   │   └── sensor_service.py  # Business logic (validation, CSV parsing)
│   ├── data/
│   │   ├── ind/               # Individual sensor CSVs
│   │   └── agg/               # Aggregated neighborhood CSVs
│   └── main.py                # FastAPI app entry point
│
```

---

## Environment Variables

Create `fe-aq-dashboard/.` with the following (this file is gitignored):

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Mapbox
VITE_MAPBOX_API_KEY=pk.your_mapbox_token_here
```

**How to get these:**

- **Firebase:** [Firebase Console](https://console.firebase.google.com) → Project Settings → SDK setup
- **Mapbox:** [Mapbox Console](https://account.mapbox.com/) → Tokens (create a new token)

**Important:** All Vite env vars **must** start with `VITE_` to be accessible in the React app via `import.meta.env.VITE_VARIABLE_NAME`

---

## API Endpoints

Full interactive docs: http://localhost:8000/docs

### Core Endpoints

| Endpoint                      | Method | Description                                          |
| ----------------------------- | ------ | ---------------------------------------------------- |
| `/sensor/{sensor_id}`         | GET    | Retrieve air quality time-series for a sensor        |
| `/sensor/{sensor_id}/battery` | GET    | Battery diagnostics and charge history               |
| `/locations/`                 | GET    | Spatial metadata for all sensors (for map rendering) |
| `/sensor/test`                | GET    | Health check endpoint                                |

**Example Request:**

```bash
curl "http://localhost:8000/sensor/ind_2?time_range=week"
```

**Response Schema:**

```typescript
{
  dataset: {
    sensor_id: string
    start_date: datetime
    end_date: datetime
    interval: "10min" | "hourly" | "daily"
    records: AirQualityRecord[]
    count: number
  }
  stats?: {
    avg_pm2_5: float
    max_pm2_5: float
    min_pm2_5: float
    dominant_pollutant: string
  }
}
```

See [API Documentation](docs/API.md) for complete request/response schemas.

---

## Troubleshooting

| Issue                                      | Solution                                                             |
| ------------------------------------------ | -------------------------------------------------------------------- |
| **"CORS error when fetching sensor data"** | Backend not running. Start with `uvicorn main:app --reload`          |
| **"Map tiles not loading"**                | Check `VITE_MAPBOX_API_KEY` in `.env` file                           |
| **"Firebase auth failing"**                | Verify all `VITE_FIREBASE_*` environment variables are set correctly |
| **"Sensors not appearing on map"**         | Check browser console for `/locations` endpoint errors               |
| **"Module not found" errors**              | Run `npm install` in `fe-aq-dashboard/`                              |
| **Python import errors**                   | Activate conda env: `conda activate aq_dashboard_env`                |

---

## Tech Stack

| Component              | Technology            | Why This Choice                                     | Key Files        |
| ---------------------- | --------------------- | --------------------------------------------------- | ---------------- |
| **Frontend Framework** | React 18 + TypeScript | Type safety for complex air quality data structures | `src/`           |
| **Build Tool**         | Vite                  | Fast HMR, modern ES modules                         | `vite.config.ts` |
| **UI Library**         | Chakra UI             | Accessible components, dark mode support            | `theme.ts`       |
| **3D Mapping**         | Mapbox + Threebox     | Only combo supporting vertical 3D positioning       | `Map3D.tsx`      |
| **Backend**            | FastAPI + Python 3.11 | Auto-generated docs, Pydantic validation            | `main.py`        |
| **Authentication**     | Firebase Auth         | Quick OAuth setup, handles roles                    | `auth.ts`        |
| **Database**           | Firestore             | NoSQL, real-time sync                               | `auth.ts   `     |

---
