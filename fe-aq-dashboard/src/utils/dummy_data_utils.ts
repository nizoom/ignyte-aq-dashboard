// This file helps to organize dummy sensors for the user before this is replaced with connections to firebase

// List layer
// type IndSensorMetaData = {
//   onlineStatus: boolean;
//   location_name_name: string;
//   filename: string;
// };
// type AggSensorMetaData = {
//   onlineStatus: boolean;
//   area: string;
//   filename: string;
// };

export type GeneralSensorMetaData = {
  onlineStatus: boolean;
  location_name: string;
  filename: string;
};
export const generalSensorsMetaData: GeneralSensorMetaData[] = [
  { onlineStatus: true, location_name: "370 Jay St", filename: "ind_1.csv" },
  { onlineStatus: false, location_name: "205 Smith St", filename: "ind_2.csv" },
  { onlineStatus: true, location_name: "5 Metrotech", filename: "ind_3.csv" },
  {
    onlineStatus: true,
    location_name: "Financial District",
    filename: "agg_1.csv",
  },
  { onlineStatus: true, location_name: "Forte Green", filename: "agg_2.csv" },
  { onlineStatus: true, location_name: "Williamsburg", filename: "agg_3.csv" },
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
