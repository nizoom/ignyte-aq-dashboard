import {
  Grid,
  GridItem,
  Text,
  Separator,
  VStack,
  Select,
  createListCollection,
  Box,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AQIMeter from "../components/ui/dashboard-ui/aqi-meter";
import { Link, useLocation } from "react-router-dom";
import { getSensorDataFromDB } from "../utils/fetch_req";
import type { AirQualityResponse } from "../utils/types";
import LineGraphs from "../components/ui/dashboard-ui/graphs/line-graph";
import DatePicker from "../components/ui/dashboard-ui/datepicker";

type TimeRange = "Day" | "Week" | "Month" | "3 month";

const DashboardPage = () => {
  const [healthMsg, setHealthMsg] = useState("");
  const handleHealthAdvMsg = (msg: string) => {
    setHealthMsg(msg);
  };

  const location = useLocation();
  const { sensorId } = location.state || {};

  const [dataset, setDataset] = useState<AirQualityResponse | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("Day");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2024, 9, 29) // October 29, 2024
  );

  const startDate = new Date(2025, 7, 1, 0, 0, 0); // Aug 1, 2025
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 90); // 90 days later

  useEffect(() => {
    async function load() {
      if (!selectedDate) return; // Don't load if no date selected

      // Format selectedDate to YYYY-MM-DD
      const startDate = selectedDate.toISOString().split("T")[0];
      let endDate = "";

      // Calculate end date based on time range
      const end = new Date(selectedDate);
      switch (timeRange) {
        case "Day":
          end.setDate(end.getDate() + 1); // 1 day
          break;
        case "Week":
          end.setDate(end.getDate() + 7); // 7 days
          break;
        case "Month":
          end.setMonth(end.getMonth() + 1); // 1 month
          break;
        case "3 month":
          end.setMonth(end.getMonth() + 3); // 3 months
          break;
      }

      endDate = end.toISOString().split("T")[0];

      const data = await getSensorDataFromDB({
        sensor_id: sensorId,
        time_range: timeRange,
        start_date: startDate,
        end_date: endDate,
      });

      if (data) setDataset(data);
      console.log(dataset?.AQIStats);
    }

    load();
  }, [sensorId, timeRange, selectedDate]); // Added selectedDate to dependencies

  const timeRanges = createListCollection({
    items: [
      { label: "Day", value: "Day" },
      { label: "Week", value: "Week" },
      { label: "Month", value: "Month" },
      { label: "3 month", value: "3 month" },
    ],
  });

  return (
    <Grid templateColumns={"auto 1fr 1fr"} alignItems="start" gap={0}>
      <GridItem maxW={200}>
        <Link to={"/sensor_map"}>
          <Button className="jump-to-location-btn " m={5}>
            ← Back
          </Button>{" "}
        </Link>
      </GridItem>
      <GridItem mr={20}>
        <VStack textAlign={"center"}>
          <Text fontSize={"2xl"} mt={10} mb={-20} pb={0}>
            Today's AQI
          </Text>
          <AQIMeter
            width={700}
            height={600}
            currentValue={dataset?.AQIStats.overall_aqi ?? 0}
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
          <Box mt={10}>
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              startDate={new Date(2024, 7, 1)} // Aug 1, 2024
              endDate={new Date(2024, 10, 29)} // Nov 29, 2024 (or calculate +90 days)
            />
          </Box>
        </VStack>
      </GridItem>

      <GridItem textAlign={"center"} ml={-90}>
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
