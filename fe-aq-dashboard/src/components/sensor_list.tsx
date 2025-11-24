import { Stack, List, Text, Grid, GridItem } from "@chakra-ui/react";
import SensorLinkBtns from "./ui/sensor-link-btns";
import "../App.css";

const SensorList = () => {
  return (
    <Stack>
      <List.Root textAlign={"left"} ml={10} gap={5}>
        <List.Item>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={2}>
              <Text textStyle={"3xl"} style={{ fontFamily: "Josefin Slab" }}>
                Sensor 1: 370 Jay St
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <SensorLinkBtns />
            </GridItem>
          </Grid>
        </List.Item>

        <List.Item>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={2}>
              <Text textStyle={"3xl"} style={{ fontFamily: "Josefin Slab" }}>
                Sensor 2: 205 Smith St
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <SensorLinkBtns />
            </GridItem>
          </Grid>
        </List.Item>

        <List.Item>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={2}>
              <Text textStyle={"3xl"} style={{ fontFamily: "Josefin Slab" }}>
                Sensor 3: 5 Metrotech
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <SensorLinkBtns />
            </GridItem>
          </Grid>
        </List.Item>
      </List.Root>
    </Stack>
  );
};

export default SensorList;
