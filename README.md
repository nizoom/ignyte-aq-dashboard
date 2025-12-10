# Urban Air Quality API Documentation

## Overview

## Endpoints

### Sensors

#### `GET /sensor/test`

Test endpoint to verify sensor routes are working.

**Response**

```json
{
  "status": "success",
  "message": "Test route working"
}

    uvicorn main:app --reload
```

---

#### `GET /sensor/{sensor_id}`

Retrieve air quality data for a specific sensor.

**Path Parameters**

- `sensor_id` (string, required) - Unique identifier for the sensor (e.g., `ind_2.csv`)

**Query Parameters**

- `time_range` (string, optional) - Predefined time range for the query
  - Options: `"day"`, `"week"`, `"month"`, `"3 month"`
  - Default: `"day"`
- `start_date` (datetime, optional) - Custom start date (overrides time_range if provided)
- `end_date` (datetime, optional) - Custom end date (overrides time_range if provided)

**Response Model**: `AirQualityResponse`

**Example Request**

```typescript
GET http://localhost:8000/sensor/ind_2?time_range=day
```

**Example Response**

```json
{
  "dataset": {
    "sensor_id": "ind_2",
    "start_date": "2024-01-01T00:00:00",
    "end_date": "2024-01-01T23:59:59",
    "interval": "10min",
    "records": [
      {
        "timestamp": "2024-01-01T00:00:00",
        "temp": 22.5,
        "hum": 65.0,
        "batt_soc": 85.0,
        "batt_temp": 25.0,
        "pm2_5": 12.5,
        "pm10": 25.0,
        "no2_we": 0.5,
        "ox_we": 0.8
      }
    ],
    "count": 1
  },
  "stats": {
    "avg_pm2_5": 12.5,
    "max_pm2_5": 15.0,
    "min_pm2_5": 10.0,
    "avg_temp": 22.5,
    "avg_hum": 65.0,
    "count": 1
  }
}
```

---

### Locations

#### `GET /locations/`

Get spatial information for all sensor locations.

---

## Data Models

### AirQualityResponse

Complete API response with dataset and optional statistics.

**Fields**

- `dataset` (AirQualityDataset, required) - The air quality dataset
- `stats` (AirQualityStats, optional) - Pre-calculated summary statistics

---

### AirQualityDataset

A collection of air quality records along with dataset metadata.

**Fields**

- `sensor_id` (string, required) - Unique sensor identifier
- `start_date` (datetime, required) - Start timestamp of the data range
- `end_date` (datetime, required) - End timestamp of the data range
- `interval` (string, required) - Aggregation interval
  - Options: `"10min"`, `"hourly"`, `"daily"`
- `records` (List[AirQualityRecord], required) - Array of air quality records
- `count` (integer, computed) - Actual number of records in the dataset

---

### AirQualityRecord

Represents a single snapshot of air quality and sensor readings.

**Fields**

- `timestamp` (datetime, required) - Time of the reading
- `temp` (float, required) - Temperature in degrees Farenheight
- `hum` (float, required) - Humidity in percentage
- `batt_soc` (float, required) - Battery State of Charge (%)
- `batt_temp` (float, required) - Battery temperature in degrees Farenheight
- `pm2_5` (float, required) - Concentration of Particulate Matter 2.5 (µg/m³)
- `pm10` (float, required) - Concentration of Particulate Matter 10 (µg/m³)
- `no2_we` (float, required) - NO2 Working Electrode reading (mV)
- `ox_we` (float, required) - Oxidizing Gas Working Electrode reading (mV)

---

### AirQualityStats

Summary statistics calculated over a dataset/time range.

**Fields**

- `avg_pm2_5` (float, required) - Average PM2.5 concentration
- `max_pm2_5` (float, required) - Maximum PM2.5 concentration
- `min_pm2_5` (float, required) - Minimum PM2.5 concentration
- `avg_temp` (float, required) - Average temperature
- `avg_hum` (float, required) - Average humidity
- `count` (integer, required) - Number of records used for statistics

---

### AirQualityQueryParams

Defines the parameters for querying historical air quality data.

**Fields**

- `sensor_id` (string, required) - Sensor identifier
- `time_range` (string, required) - Predefined time range
  - Options: `"day"`, `"week"`, `"month"`, `"3 month"`
- `start_date` (datetime, optional) - Custom start date
- `end_date` (datetime, optional) - Custom end date

---

### CSVMetaData

Base metadata for CSV files.

**Fields**

- `sensor_id` (string, required) - Sensor identifier
- `file_name` (string, required) - Name of the CSV file

---

### IndMetaData

Metadata for individual sensor dummy data CSV.

**Extends**: CSVMetaData

**Fields**

- `address` (string, required) - Physical address of the sensor
- `coords` (List[float], required) - GPS coordinates [lat, lon]
- `name` (string, required) - Human-readable sensor name
- `altitude` (integer, required) - Altitude in meters

---

### AggMetaData

Metadata for aggregated dummy data CSV.

**Extends**: CSVMetaData

**Fields**

- `neighborhood_name` (string, required) - Name of the neighborhood
- `neighborhood_bounds` (List[float], required) - Geographic bounds

---

### GeneralSensorMetaData

General, non-time-series information about a sensor.

**Fields**

- `onlineStatus` (boolean, required) - Whether the sensor is currently online
- `location_name` (string, required) - Location name
- `filename` (string, required) - Associated filename
- `altitude` (float, required) - Altitude of the sensor in meters

---

## Data Flow

### Frontend → Backend Flow

```
┌─────────────────┐
│   React App     │
│  (TypeScript)   │
└────────┬────────┘
         │
         │ 1. User selects sensor and time range
         │
         ▼
┌─────────────────────────────────────────┐
│  getSensorDataFromDB()                  │
│  - Constructs AirQualityQueryParams     │
│  - Makes axios GET request              │
└────────┬────────────────────────────────┘
         │
         │ 2. HTTP GET /sensor/{sensor_id}?time_range=day
         │
         ▼
┌─────────────────────────────────────────┐
│  FastAPI Backend (main.py)              │
│  - CORS middleware                      │
│  - Routes to sensors router             │
└────────┬────────────────────────────────┘
         │
         │ 3. Route: GET /sensor/{sensor_id}
         │
         ▼
┌─────────────────────────────────────────┐
│  sensors.router.get_sensor_data()       │
│  - Validates sensor_id path param       │
│  - Validates query params               │
│  - Calls check_for_real_sensor()        │
└────────┬────────────────────────────────┘
         │
         │ 4. Verify sensor exists
         │
         ▼
┌─────────────────────────────────────────┐
│  sensor_service.check_for_real_sensor() │
│  - Checks data/ind/ folder              │
│  - Checks data/agg/ folder              │
│  - Returns True/False                   │
└────────┬────────────────────────────────┘
         │
         │ 5. If valid, construct response
         │
         ▼
┌─────────────────────────────────────────┐
│  Build AirQualityResponse               │
│  - Create AirQualityDataset             │
│  - Create List[AirQualityRecord]        │
│  - Calculate AirQualityStats            │
│  - Validate against Pydantic models     │
└────────┬────────────────────────────────┘
         │
         │ 6. JSON response
         │
         ▼
┌─────────────────────────────────────────┐
│  Frontend Receives Response             │
│  - TypeScript types validate            │
│  - Updates React state                  │
│  - Renders visualization (visx charts)  │
└─────────────────────────────────────────┘
```

---

## File Structure

```
project/
├── main.py                    # FastAPI app entry point
├── routers/
│   ├── sensors.py            # Sensor-related endpoints
│   └── locations.py          # Location endpoints
├── models/
│   └── models.py             # Pydantic models/schemas
├── services/
│   └── sensor_service.py     # Business logic (validation, data retrieval)
├── data/
│   ├── ind/                  # Individual sensor CSV files
│   └── agg/                  # Aggregated sensor CSV files
└── frontend/
    └── src/
        └── api/
            └── sensors.ts    # API client functions
```

---
