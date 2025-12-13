import { Threebox } from "threebox-plugin";
import "threebox-plugin/dist/threebox.css";
import type { Map } from "mapbox-gl";
import type { LocationsResponse } from "../../utils/types";

let threeboxInstance: any = null;
let isInitialized = false;

export const initializeThreebox = (map: Map) => {
  if (!threeboxInstance && !isInitialized) {
    isInitialized = true;
    console.log("🔧 Initializing Threebox...");

    const ThreeboxConstructor = Threebox as any;
    threeboxInstance = new ThreeboxConstructor(
      map,
      map.getCanvas().getContext("webgl"),
      {
        defaultLights: true,
      }
    );

    console.log("✅ Threebox initialized:", threeboxInstance);
    (window as any).tb = threeboxInstance;
  }
  return threeboxInstance;
};

export const addSensorStems = (map: Map, data: LocationsResponse) => {
  console.log(
    "🎯 Adding sensor stems for",
    data.ind_spatial_data.length,
    "sensors"
  );

  if (map.getLayer("sensor-stems-3d")) {
    console.log("Removing existing layer");
    map.removeLayer("sensor-stems-3d");
  }

  const tb = initializeThreebox(map);

  // Check if tb has the right methods
  console.log("TB methods:", {
    hasLine: typeof tb.line,
    hasAdd: typeof tb.add,
    hasUpdate: typeof tb.update,
    objects: tb.objects,
  });

  map.addLayer({
    id: "sensor-stems-3d",
    type: "custom",
    renderingMode: "3d",
    onAdd: function (map: any, gl: any) {
      console.log("🎨 onAdd called");

      data.ind_spatial_data.forEach((sensor, index) => {
        const altitude = sensor.altitude || 50;
        const [lng, lat] = sensor.coords;

        console.log(
          `📍 Stem ${index + 1}: [${lng}, ${lat}] height: ${altitude}m`
        );

        try {
          // Try different geometry format - Threebox might want objects
          const lineGeometry = {
            type: "LineString",
            coordinates: [
              [lng, lat, 0],
              [lng, lat, altitude],
            ],
          };

          console.log("Geometry:", lineGeometry);

          const line_vertical = tb.line({
            geometry: lineGeometry.coordinates,
            color: "red", // Try bright red
            width: 10, // Make it thicker
            opacity: 1,
          });

          console.log("Line object created:", line_vertical);
          console.log("Line visible?:", line_vertical.visible);

          tb.add(line_vertical);

          // Check if it was added
          console.log("TB objects after add:", tb.objects);
          console.log(`✅ Stem ${index + 1} added`);
        } catch (error) {
          console.error(`❌ Error adding stem ${index + 1}:`, error);
        }
      });

      console.log("🎉 Final TB objects:", tb.objects);
    },
    render: function (gl: any, matrix: any) {
      tb.update();
    },
  });

  console.log("✅ Layer added to map");
};

export const clearThreebox = () => {
  isInitialized = false;
  if (threeboxInstance) {
    threeboxInstance.clear();
    threeboxInstance = null;
    delete (window as any).tb;
  }
};
