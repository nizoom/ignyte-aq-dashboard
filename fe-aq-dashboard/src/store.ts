// stores/mapStore.ts
import { create } from "zustand";
import type { LocationsResponse } from "./utils/types";
import type { User } from "firebase/auth";

type MapStore = {
  map: mapboxgl.Map | null;
  locations: LocationsResponse | null;
  setMap: (map: mapboxgl.Map | null) => void;
  setLocations: (locations: LocationsResponse | null) => void;
  flyToLocation: (locationName: string) => void;
};

export type UserRole = "researcher" | "resident";

export interface AppUser {
  uid: string;
  role: UserRole;
}

interface AuthState {
  firebaseUser: User | null;
  user: AppUser | null;
  loading: boolean;

  setAuth: (fbUser: User | null, user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;

  isResearcher: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  user: null,
  loading: true,

  setAuth: (firebaseUser, user) => set({ firebaseUser, user, loading: false }),

  setLoading: (loading) => set({ loading }),

  isResearcher: () => get().user?.role === "researcher",
}));

export const useMapStore = create<MapStore>((set, get) => ({
  map: null,
  locations: null,
  setMap: (map) => set({ map }),
  setLocations: (locations) => set({ locations }),
  flyToLocation: (locationName) => {
    const isResearcher = useAuthStore.getState().user?.role === "researcher";

    const { map, locations } = get();
    console.log("flyToLocation called with:", locationName);
    console.log("Map:", map);
    console.log("Locations:", locations);

    if (!map) {
      console.log("Map not ready yet");
      return;
    }

    if (!locations) {
      console.log("Locations not loaded yet");
      return;
    }

    // Make sure map is fully loaded
    if (!map.loaded()) {
      map.once("load", () => {
        get().flyToLocation(locationName); // Retry once loaded
      });
      return;
    }

    // Try to find in individual sensors first
    const indLocations = isResearcher
      ? [
          ...locations.ind_spatial_data,
          ...locations.researcher_view_spatial_data,
        ]
      : locations.ind_spatial_data;

    const sensor = indLocations.find(
      (s) => s.name === locationName || s.address?.includes(locationName)
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
