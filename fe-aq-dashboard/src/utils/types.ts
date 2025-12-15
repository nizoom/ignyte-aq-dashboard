// This file helps to organize dummy sensors for the user before this is replaced with connections to firebase

import type { StringLike } from "@visx/scale";

export interface AirQaulityRecord {
  timestamp: Date;
  temp: number;
  hum: number;
  batt_soc: number;
  batt_temp: number;
  pm2_5: number;
  pm10: number;
  no2_we: number;
  ox_we: number;
}

export interface AirQualityDataset {
  sensor_id: string;
  start_date: string;
  end_date: string;
  interval: "10min" | "hourly" | "daily";
  records: AirQaulityRecord[];
  count: number;
}

export interface BatteryQueryParams {
  sensor_id: string;
  start_date?: string;
}

export interface AirQaulityQueryParams {
  sensor_id: string;
  time_range: "Day" | "Week" | "Month" | "3 month";
  start_date?: string;
  end_date?: string;
}
export interface AirQualityStats {
  avg_pm2_5: number;
  max_pm2_5: number;
  min_pm2_5: number;
  avg_temp: number;
  avg_hum: number;
  count: number;
}

export interface AQIStats {
  overall_aqi: number;
  dominant_pollutant: string;
  individual_aqis?: { [key: string]: number }; // Optional dictionary (object) of pollutant names to AQI values
}
export interface AirQualityResponse {
  dataset: AirQualityDataset;
  stats: AirQualityStats; // The '?' makes the property optional, matching Python's Optional[AirQualityStats]
  AQIStats: AQIStats;
}

export interface BatteryRecord {
  timestamp: Date;
  batt_soc: number;
  batt_temp: number;
}

export interface BatteryData {
  records: BatteryRecord[];
  latest_record: BatteryRecord;
}
export interface GeneralSensorMetaData {
  onlineStatus: boolean;
  location_name: string;
  filename: string;
  altitude: number;
}
export const generalSensorsMetaData: GeneralSensorMetaData[] = [
  {
    onlineStatus: true,
    location_name: "370 Jay St",
    filename: "ind_1.csv",
    altitude: 50,
  },
  {
    onlineStatus: false,
    location_name: "205 Smith St",
    filename: "ind_2.csv",
    altitude: 100,
  },
  {
    onlineStatus: true,
    location_name: "5 Metrotech",
    filename: "ind_3.csv",
    altitude: 10,
  },
  {
    onlineStatus: true,
    location_name: "Financial District",
    filename: "agg_1.csv",
    altitude: 5,
  },
  {
    onlineStatus: true,
    location_name: "Forte Green",
    filename: "agg_2.csv",
    altitude: 5,
  },
  {
    onlineStatus: true,
    location_name: "Williamsburg",
    filename: "agg_3.csv",
    altitude: 5,
  },
];

// CSV metadata base
export interface CSVMetaData {
  sensor_id: string;
  file_name: string;
}

// Individual sensor metadata
export interface IndMetaData extends CSVMetaData {
  address: string;
  coords: [number, number]; // lon, lat
  name: string;
  altitude: number;
}

// Aggregated metadata
export interface AggMetaData extends CSVMetaData {
  neighborhood_name: string;
  neighborhood_bounds: [number, number, number, number];
  // [westLon, southLat, eastLon, northLat]
}

// What the API returns
export interface LocationsResponse {
  ind_spatial_data: IndMetaData[];
  agg_spatial_data: AggMetaData[];
}
