import { Stack, List, Text, Grid, GridItem, HStack } from "@chakra-ui/react";
import SensorLinkBtns from "./ui/sensor-link-btns";
import { type GeneralSensorMetaData } from "../utils/types";
import { Tooltip } from "../src/components/ui/tooltip";
import "../App.css";

interface SensorListProps {
  sensorMetaData: GeneralSensorMetaData[];
}

const SensorList = ({ sensorMetaData }: SensorListProps) => {
  return (
    <Stack>
      <List.Root textAlign={"left"} ml={10} gap={5}>
        {sensorMetaData.map((sensor: GeneralSensorMetaData, index) => (
          <List.Item key={index}>
            <Grid templateColumns="repeat(4, 1fr)" gap={4} alignItems="center">
              <GridItem colSpan={2}>
                <HStack alignItems={"flex-end"}>
                  <Text
                    textStyle={"3xl"}
                    style={{ fontFamily: "Josefin Slab" }}
                  >
                    Sensor {index + 1}: {sensor.location_name}
                  </Text>
                  {sensor.onlineStatus ? (
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
                  ) : (
                    <Tooltip
                      content="Email a.guibaud@nyu.edu for assistance"
                      positioning={{ placement: "right-end" }}
                    >
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
                    </Tooltip>
                  )}
                </HStack>
              </GridItem>

              <GridItem colSpan={2}>
                <SensorLinkBtns
                  location_name={sensor.location_name}
                  filename={sensor.filename}
                />
              </GridItem>
            </Grid>
          </List.Item>
        ))}
      </List.Root>
    </Stack>
  );
};

export default SensorList;
