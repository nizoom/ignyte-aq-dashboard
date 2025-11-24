import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import SensorList from "../components/sensor_list";
import MapComponent from "../components/map-componenents/map";
const SensorMap = () => {
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={2}>
      <GridItem colSpan={2} style={{ outline: "2px solid red" }}>
        <Box height={"100%"}>
          <MapComponent />
        </Box>
      </GridItem>

      <GridItem colSpan={3} style={{ outline: "2px solid green" }}>
        <Box h="20">
          <Text
            textStyle={"5xl"}
            textAlign={"left"}
            mb={10}
            style={{ fontFamily: "Josephin Slab" }}
          >
            Map View
          </Text>
          <Text textStyle={"4xl"} textAlign={"left"} mb={5} ml={10}>
            My sensors
          </Text>
          <SensorList />
          <Text textStyle={"4xl"} textAlign={"left"} mt={10} ml={10} mb={10}>
            Aggregated Sensors
          </Text>
          <SensorList />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default SensorMap;
