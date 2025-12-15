import { Text, HStack, VStack, Flex, Box } from "@chakra-ui/react";
import BatterySvg from "../components/ui/battery_svg";
import { useLocation } from "react-router-dom";
import BatteryLineGraph from "../components/ui/dashboard-ui/graphs/soc-graph";

const BatteryDiagPage = () => {
  const location = useLocation();
  const { batteryData, batteryPercentage, sensorId } = location.state;
  console.log(batteryData);
  // const batteryPercentage = 51;
  return (
    <>
      <Text m={75} fontSize={"5xl"}>
        Sensor Diagnostics [{sensorId.slice(0, 5)}]
      </Text>
      <HStack mt={100} ml={50} gap={10}>
        <BatterySvg batteryPercentage={50} />
        <Text fontSize={"4xl"}> {batteryPercentage} %</Text>
        <VStack>
          <Flex flexDirection="column" alignSelf="flex-start" mb={2} gap={2}>
            <Text fontSize="lg" mb={5}>
              Battery State of Charge
            </Text>
            <Flex gap={4} align="center">
              <Flex align="center" gap={2}>
                <Box w="20px" h="15px" bg="#FFE5B4" opacity={0.2} />
                <Text fontSize="11px" color="#c5c2bdff">
                  Day
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Box w="20px" h="15px" bg="#2C3E50" opacity={0.15} />
                <Text fontSize="11px" color="#c5c2bdff">
                  Night
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <BatteryLineGraph data={batteryData} width={1000} height={400} />
        </VStack>
      </HStack>
    </>
  );
};

export default BatteryDiagPage;
