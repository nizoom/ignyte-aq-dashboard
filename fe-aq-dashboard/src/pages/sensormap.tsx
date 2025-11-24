import { Grid, GridItem, Box, Text, Select, HStack } from "@chakra-ui/react";
import SensorList from "../components/sensor_list";
import MapComponent from "../components/map-componenents/map";
import DropdownComponent from "../components/ui/drop-down";
const SensorMap = () => {
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={20}>
      <GridItem colSpan={2}>
        <Box height={"100%"}>
          <MapComponent />
        </Box>
      </GridItem>

      <GridItem colSpan={3}>
        <Box h="20">
          <Text
            textStyle={"5xl"}
            textAlign={"left"}
            mb={10}
            mt={10}
            style={{ fontFamily: "Josephin Slab" }}
          >
            Map View
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" alignItems="center" mb={5}>
            <GridItem colSpan={1}>
              <Text textStyle={"4xl"} textAlign={"left"} ml={10}>
                My sensors
              </Text>
            </GridItem>
            <GridItem
              colSpan={1}
              display="flex"
              justifyContent="flex-end"
              mr={"5em"}
            >
              <DropdownComponent />
            </GridItem>
          </Grid>

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
