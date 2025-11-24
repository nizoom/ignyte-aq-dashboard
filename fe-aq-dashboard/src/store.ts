// stores/mapStore.ts
import { create } from "zustand";
import type mapboxgl from "mapbox-gl";
import type { LocationsResponse } from "./utils/dummy_data_utils";

type MapStore = {
  map: mapboxgl.Map | null;
  locations: LocationsResponse | null;
  setMap: (map: mapboxgl.Map | null) => void;
  setLocations: (locations: LocationsResponse | null) => void;
  flyToLocation: (locationName: string) => void;
};

export const useMapStore = create<MapStore>((set, get) => ({
  map: null,
  locations: null,
  setMap: (map) => set({ map }),
  setLocations: (locations) => set({ locations }),
  flyToLocation: (locationName) => {
    const { map, locations } = get();
    console.log("flyToLocation called with:", locationName);

    if (!map || !locations) {
      console.log("Missing map or locations");
      return;
    }

    // Try to find in individual sensors first
    let sensor = locations.ind_spatial_data.find(
      (s) => s.address.includes(locationName) || s.name === locationName
    );

    // If not found, try aggregated sensors
    if (!sensor) {
      const aggSensor = locations.agg_spatial_data.find(
        (s) => s.neighborhood_name === locationName
      );

      if (aggSensor) {
        // For aggregated areas, fly to the center of the bounds
        const [minLng, minLat, maxLng, maxLat] = aggSensor.neighborhood_bounds;
        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;

        map.flyTo({
          center: [centerLng, centerLat],
          zoom: 14,
          pitch: 45,
          bearing: -17.6,
          duration: 2000,
        });
        return;
      }
    }

    // Handle individual sensor
    if (sensor) {
      map.flyTo({
        center: [sensor.coords[0], sensor.coords[1]],
        zoom: 16,
        pitch: 45,
        bearing: -17.6,
        duration: 2000,
      });
    } else {
      console.log("Sensor not found:", locationName);
    }
  },
}));
