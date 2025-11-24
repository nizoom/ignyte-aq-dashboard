import axios from "axios";
import type { LocationsResponse } from "./dummy_data_utils";
export async function getLocationsFromDB(): Promise<
  LocationsResponse | undefined
> {
  try {
    const res = await axios.get<LocationsResponse>(
      "http://localhost:8000/locations/locations"
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching locations:", err);
  }
}
