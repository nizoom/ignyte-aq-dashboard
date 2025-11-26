import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { add3DBuildings } from "./map_funcs";
import { Container } from "@chakra-ui/react";
import type { LocationsResponse } from "../../utils/dummy_data_utils";
import { getLocationsFromDB } from "../../utils/fetch_req";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "../../store";

const MapComponent = () => {
  const mapboxKey = import.meta.env.VITE_MAPBOX_KEY;
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [locations, setLocations] = useState<LocationsResponse | undefined>();

  // Get store setters
  const setMap = useMapStore((state) => state.setMap);
  const setStoreLocations = useMapStore((state) => state.setLocations);

  useEffect(() => {
    async function fetchData() {
      const data = await getLocationsFromDB();
      console.log("Fetched locations:", data);
      setLocations(data);
      setStoreLocations(data || null); // Set in store
      console.log("Locations set in store");
    }
    fetchData();
  }, [setStoreLocations]);

  const addIndividualMarkers = (map: mapboxgl.Map, data: LocationsResponse) => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    data.ind_spatial_data.forEach((sensor) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#FF7D00";
      el.style.border = "3px solid #FFECD1";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([sensor.coords[0], sensor.coords[1]])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="font-family: 'Josefin Slab'; padding: 5px;">
                <strong>${sensor.sensor_id}</strong><br/>
                ${sensor.address}
              </div>
            `)
        )
        .addTo(map);

      const updateMarkerOffset = () => {
        const zoom = map.getZoom();
        const offset = -20 * Math.pow(1.5, zoom - 12);
        marker.setOffset([0, Math.max(offset, -200)]);
      };

      map.on("zoom", updateMarkerOffset);
      updateMarkerOffset();

      markersRef.current.push(marker);
    });
  };

  const addAggregatedBoundaries = (
    map: mapboxgl.Map,
    data: LocationsResponse
  ) => {
    const features = data.agg_spatial_data.map((area) => {
      const [minLng, minLat, maxLng, maxLat] = area.neighborhood_bounds;

      return {
        type: "Feature" as const,
        properties: {
          name: area.neighborhood_name,
          sensor_id: area.sensor_id,
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [minLng, minLat],
              [maxLng, minLat],
              [maxLng, maxLat],
              [minLng, maxLat],
              [minLng, minLat],
            ],
          ],
        },
      };
    });

    const geojson = {
      type: "FeatureCollection" as const,
      features: features,
    };

    if (!map.getSource("agg-areas")) {
      map.addSource("agg-areas", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "agg-areas-fill",
        type: "fill",
        source: "agg-areas",
        paint: {
          "fill-color": "#15616D",
          "fill-opacity": 0.2,
        },
      });

      map.addLayer({
        id: "agg-areas-border",
        type: "line",
        source: "agg-areas",
        paint: {
          "line-color": "#FFECD1",
          "line-width": 3,
        },
      });

      map.on("click", "agg-areas-fill", (e) => {
        if (!e.features || !e.features[0]) return;
        const properties = e.features[0].properties;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div style="font-family: 'Josefin Slab'; padding: 5px;">
              <strong>${properties?.name}</strong><br/>
              ${properties?.sensor_id}
            </div>
          `
          )
          .addTo(map);
      });

      map.on("mouseenter", "agg-areas-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "agg-areas-fill", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  };

  const initializeMap = (container: HTMLElement) => {
    const map = new mapboxgl.Map({
      container: container,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.99, 40.71],
      zoom: 12.5,
      pitch: 45,
      bearing: -17.6,
    });

    map.on("style.load", () => {
      map.setFog({
        range: [0.5, 10],
        color: "#ffffff",
        "horizon-blend": 0.1,
      });
    });

    map.on("load", () => {
      console.log("Map loaded");
      add3DBuildings(map);

      if (locations) {
        addIndividualMarkers(map, locations);
        addAggregatedBoundaries(map, locations);
      }

      // Set map in store after it's loaded
      console.log("Setting map in store");
      setMap(map);
    });

    return map;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    console.log("Initializing map");
    mapboxgl.accessToken = mapboxKey;
    mapRef.current = initializeMap(mapContainerRef.current);

    setTimeout(() => {
      mapRef.current?.resize();
    }, 100);

    const handleResize = () => {
      mapRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      markersRef.current.forEach((marker) => marker.remove());
      mapRef.current?.remove();
    };
  }, [locations, setMap]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    />
  );
};

export default MapComponent;
