import { Stack, List, Text, Grid, GridItem, HStack } from "@chakra-ui/react";
import SensorLinkBtns from "./ui/sensor-link-btns";
import "../App.css";
import DropdownComponent from "./ui/drop-down";

const SensorList = () => {
  return (
    <Stack>
      <List.Root textAlign={"left"} ml={10} gap={5}>
        <List.Item>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={2}>
              <HStack alignItems={"flex-end"}>
                <Text textStyle={"3xl"} style={{ fontFamily: "Josefin Slab" }}>
                  Sensor 1: 370 Jay St{" "}
                </Text>
                <Text
                  textStyle={"lg"}
                  p={1}
                  pl={2}
                  pr={2}
                  ml={2.5}
                  style={{
                    fontFamily: "Josefin Slab",
                  }}
                  textAlign={"center"}
                >
                  Online 🟢
                </Text>
              </HStack>
            </GridItem>

            <GridItem colSpan={2}>
              <SensorLinkBtns />
            </GridItem>
          </Grid>
        </List.Item>

        <List.Item>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={2}>
              <HStack alignItems={"flex-end"}>
                <Text textStyle={"3xl"} style={{ fontFamily: "Josefin Slab" }}>
                  Sensor 2: 205 Smith St
                </Text>
                <Text
                  textStyle={"lg"}
                  p={1}
                  pl={2}
                  pr={2}
                  ml={2.5}
                  style={{
                    fontFamily: "Josefin Slab",
                  }}
                  textAlign={"center"}
                >
                  Offline 🔴
                </Text>
              </HStack>
            </GridItem>
            <GridItem colSpan={2}>
              <SensorLinkBtns />
            </GridItem>
          </Grid>
        </List.Item>

        <List.Item>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={2}>
              <HStack>
                <Text textStyle={"3xl"} style={{ fontFamily: "Josefin Slab" }}>
                  Sensor 3: 5 Metrotech
                </Text>
                <Text
                  textStyle={"lg"}
                  p={1}
                  pl={2}
                  pr={2}
                  ml={2.5}
                  style={{
                    fontFamily: "Josefin Slab",
                  }}
                  textAlign={"center"}
                >
                  Online 🟢
                </Text>
              </HStack>
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
