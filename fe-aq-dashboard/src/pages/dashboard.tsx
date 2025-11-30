import { Grid, GridItem, Text, Separator, Box, VStack } from "@chakra-ui/react";
import { useState } from "react";
import AQIMeter from "../components/ui/dashboard-ui/aqi-meter";

const DashboardPage = () => {
  const [healthMsg, setHealthMsg] = useState("");
  const handleHealthAdvMsg = (msg: string) => {
    setHealthMsg(msg);
  };

  return (
    <Grid templateColumns={"repeat(2, 1fr)"} justifyContent={"center"} gap={0}>
      <GridItem colSpan={1}>
        <VStack textAlign={"center"}>
          <AQIMeter
            width={700}
            height={600}
            currentValue={275}
            handleHealthAdvMsg={handleHealthAdvMsg}
          />
          <Separator
            orientation="vertical"
            borderColor="#FFECD1"
            borderWidth="1px"
            zIndex={2}
            h={100}
          />
          <Text
            border={"2px solid #FFECD1"}
            borderRadius={"24px"}
            w={"50%"}
            p={5}
          >
            {healthMsg}
          </Text>
        </VStack>
      </GridItem>

      <GridItem colSpan={1} textAlign={"center"}>
        {/* Right side content */}
      </GridItem>
    </Grid>
  );
};

export default DashboardPage;
