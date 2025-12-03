import {
  Grid,
  GridItem,
  Text,
  Separator,
  VStack,
  Button,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AQIMeter from "../components/ui/dashboard-ui/aqi-meter";
import { useLocation } from "react-router-dom";
import { getSensorDataFromDB } from "../utils/fetch_req";
import type { AirQualityResponse } from "../utils/types";
import LineGraphs from "../components/ui/dashboard-ui/graphs/line-graph";

type TimeRange = "Day" | "Week" | "Month" | "3 month";

const DashboardPage = () => {
  const [healthMsg, setHealthMsg] = useState("");
  const handleHealthAdvMsg = (msg: string) => {
    setHealthMsg(msg);
  };

  const location = useLocation();
  const { sensorId, currentValue } = location.state || {};

  const [dataset, setDataset] = useState<AirQualityResponse | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("Day");

  useEffect(() => {
    async function load() {
      const startDate = "2024-10-01"; // Fixed start
      let endDate = "";

      // Calculate end date based on time range
      switch (timeRange) {
        case "Day":
          endDate = "2024-10-02"; // 1 day
          break;
        case "Week":
          endDate = "2024-10-08"; // 7 days
          break;
        case "Month":
          endDate = "2024-11-01"; // 1 month
          break;
        case "3 month":
          endDate = "2025-01-01"; // 3 months
          break;
      }

      const data = await getSensorDataFromDB({
        sensor_id: sensorId,
        time_range: timeRange,
        start_date: startDate,
        end_date: endDate,
      });

      if (data) setDataset(data);
    }

    load();
  }, [sensorId, timeRange]);

  const timeRanges = createListCollection({
    items: [
      { label: "Day", value: "Day" },
      { label: "Week", value: "Week" },
      { label: "Month", value: "Month" },
      { label: "3 month", value: "3 month" },
    ],
  });

  return (
    <Grid templateColumns={"repeat(2, 1fr)"} justifyContent={"center"} gap={0}>
      <GridItem colSpan={1}>
        <VStack textAlign={"center"}>
          <Text fontSize={"2xl"} mt={10} mb={-10} pb={0}>
            Today's AQI
          </Text>
          <AQIMeter
            width={700}
            height={600}
            currentValue={75}
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
        <Select.Root
          collection={timeRanges}
          mt={10}
          onValueChange={(details) => {
            // <-- 3. handler
            setTimeRange(details.value[0] as TimeRange);
          }}
        >
          <Select.Label>Time Range</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select a range (Day)" />
            </Select.Trigger>
          </Select.Control>

          <Select.Positioner>
            <Select.Content>
              <Select.ItemGroup>
                {timeRanges.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>

        {dataset && <LineGraphs width={700} height={600} data={dataset} />}
      </GridItem>
    </Grid>
  );
};

export default DashboardPage;
