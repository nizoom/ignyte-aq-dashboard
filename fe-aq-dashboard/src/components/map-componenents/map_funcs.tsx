import mapboxgl, { Map as MapboxMap, type Layer } from "mapbox-gl";
export function add3DBuildings(map: MapboxMap) {
  const layers = (map.getStyle().layers ?? []) as Layer[];
  const labelLayerId = layers.find(
    (layer) =>
      layer.type === "symbol" && layer.layout && "text-field" in layer.layout
  )?.id;
  map.addLayer(
    {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          16,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          16,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    },
    labelLayerId
  );
}
