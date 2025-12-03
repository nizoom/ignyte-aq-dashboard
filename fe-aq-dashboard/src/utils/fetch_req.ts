import axios from "axios";
import type {
  LocationsResponse,
  AirQualityDataset,
  AirQualityResponse,
  AirQaulityQueryParams,
} from "./types";

// Dashboard queries
export async function getSensorDataFromDB(
  params: AirQaulityQueryParams
): Promise<AirQualityDataset | undefined> {
  console.log(params.sensor_id);
  try {
    const res = await axios.get<AirQualityResponse>(
      `http://0.0.0.0:8000/sensor/${params.sensor_id}`, // Changed to 0.0.0.0
      {
        params: {
          time_range: params.time_range,
          start_date: params.start_date,
          end_date: params.end_date,
        },
      }
    );
    console.log(res.data.dataset);
    return res.data.dataset;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}
// Map queries

export async function getLocationsFromDB(): Promise<
  LocationsResponse | undefined
> {
  try {
    const res = await axios.get<LocationsResponse>(
      "http://localhost:8000/locations/"
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching locations:", err);
  }
}
