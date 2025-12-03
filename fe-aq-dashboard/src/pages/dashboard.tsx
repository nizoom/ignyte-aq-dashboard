import { Grid, GridItem, Text, Separator, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AQIMeter from "../components/ui/dashboard-ui/aqi-meter";
import { useLocation } from "react-router-dom";
import { getSensorDataFromDB } from "../utils/fetch_req";
import type { AirQualityDataset } from "../utils/types";
// import LineGraphs from "../components/ui/dashboard-ui/graphs/line-graph";
const DashboardPage = () => {
  const [healthMsg, setHealthMsg] = useState("");
  const handleHealthAdvMsg = (msg: string) => {
    setHealthMsg(msg);
  };

  const location = useLocation();
  const { sensorId, currentValue } = location.state || {};

  const [dataset, setDataset] = useState<AirQualityDataset | null>(null);

  useEffect(() => {
    async function load() {
      // console.log(sensorId);
      const data = await getSensorDataFromDB({
        sensor_id: sensorId,
        time_range: "week",
        start_date: "2024-08-01",
        end_date: "2024-08-07",
      });

      if (data) setDataset(data);
    }

    load();
  }, [sensorId]);

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

      <GridItem colSpan={1} textAlign={"center"}></GridItem>
    </Grid>
  );
};

export default DashboardPage;
