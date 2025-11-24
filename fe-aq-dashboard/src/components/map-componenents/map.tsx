import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { add3DBuildings } from "./map_funcs";
import { Container } from "@chakra-ui/react";

const MapComponent = () => {
  const mapboxKey = import.meta.env.VITE_MAPBOX_KEY;
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const initializeMap = (container: HTMLElement) => {
    const map = new mapboxgl.Map({
      container: container,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.0242, 40.6941],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
    });

    map.on("load", () => {
      add3DBuildings(map);
    });
    return map;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = mapboxKey;
    mapRef.current = initializeMap(mapContainerRef.current);
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return <Container ref={mapContainerRef} minH={"100vh"}></Container>;
};

export default MapComponent;
