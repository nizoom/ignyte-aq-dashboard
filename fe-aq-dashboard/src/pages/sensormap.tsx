import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import SensorList from "../components/sensor_list";
import MapComponent from "../components/map-componenents/map";
import DropdownComponent from "../components/ui/drop-down";
import { generalSensorsMetaData, type LocationsResponse } from "../utils/types";
import { useEffect, useState } from "react";
import { getLocationsFromDB } from "../utils/fetch_req";
import AddSensorBtn from "../components/ui/add-btn";

const SensorMap = () => {
  const [locations, setLocations] = useState<LocationsResponse | undefined>();

  useEffect(() => {
    async function fetchData() {
      const data = await getLocationsFromDB();
      setLocations(data);
    }
    fetchData();
  }, []);

  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={20} h="100vh">
      <GridItem colSpan={2}>
        <Box height="100vh" position="sticky" top={0}>
          <MapComponent />
        </Box>
      </GridItem>

      <GridItem colSpan={3}>
        <Box>
          <Text
            textStyle={"5xl"}
            textAlign={"left"}
            mb={10}
            mt={10}
            style={{ fontFamily: "Josefin Slab" }}
          >
            Map View
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" alignItems="center" mb={5}>
            <GridItem colSpan={1}>
              <Text textStyle={"4xl"} textAlign={"left"} ml={10}>
                My sensors
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <AddSensorBtn />
            </GridItem>
            <GridItem
              colSpan={2}
              display="flex"
              justifyContent="flex-end"
              mr={"5em"}
            >
              <DropdownComponent />
            </GridItem>
          </Grid>

          <SensorList sensorMetaData={generalSensorsMetaData.slice(0, 3)} />
          <Text textStyle={"4xl"} textAlign={"left"} mt={10} ml={10} mb={10}>
            Aggregated Sensors
          </Text>
          <SensorList sensorMetaData={generalSensorsMetaData.slice(3)} />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default SensorMap;
