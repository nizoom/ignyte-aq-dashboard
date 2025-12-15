import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { curveMonotoneX } from "@visx/curve";
import { extent, max } from "d3-array";
import { IoMdDownload } from "react-icons/io";
import { exportPMDataToCSV, exportGasDataToCSV } from "./graph-util";

import type {
  AirQualityResponse,
  AirQaulityRecord,
} from "../../../../utils/types";
import "../../../../App.css";
import { Flex, Box, Text, Button, HStack } from "@chakra-ui/react";

interface LineChartProps {
  width: number;
  height: number;
  data: AirQualityResponse;
}

const LineGraph = ({ width, height, data }: LineChartProps) => {
  const records = data.dataset.records;
  const margin = { top: 20, right: 80, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Data accessors
  const getDate = (d: AirQaulityRecord) => new Date(d.timestamp);

  // X scale (shared by both charts)
  const xScale = scaleTime({
    domain: extent(records, getDate) as [Date, Date],
    range: [0, chartWidth],
  });

  // PM scales
  const pmScale = scaleLinear({
    domain: [
      0,
      Math.max(
        max(records, (d) => d.pm2_5) || 0,
        max(records, (d) => d.pm10) || 0
      ),
    ],
    range: [chartHeight, 0],
    nice: true,
  });

  // Gas scales (converting mV to ppb for display)
  const gasScale = scaleLinear({
    domain: [
      0,
      Math.max(
        max(records, (d) => d.no2_we) || 0,
        max(records, (d) => d.ox_we) || 0
      ),
    ],
    range: [chartHeight, 0],
    nice: true,
  });

  const Chart = ({
    title,
    yLabel,
    lines,
    yScale,
  }: {
    title: string;
    yLabel: string;
    lines: Array<{
      key: string;
      label: string;
      accessor: (d: AirQaulityRecord) => number;
      color: string;
    }>;
    yScale: any;
  }) => (
    <Box mb={8}>
      <HStack justify="space-between" width="100%">
        <Button
          width={10}
          className="jump-to-location-btn"
          onClick={() => {
            title === "Particulate Matter"
              ? exportPMDataToCSV(data)
              : exportGasDataToCSV(data);
          }}
        >
          <IoMdDownload />
        </Button>
        <Text fontSize="lg" fontWeight="600" mb={2}>
          {title}
        </Text>
        <Box width={10} /> {/* Empty spacer to balance */}
      </HStack>

      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows
            scale={yScale}
            width={chartWidth}
            stroke="#e0e0e0"
            strokeOpacity={0.3}
          />

          {/* Lines */}
          {lines.map(({ key, accessor, color }) => (
            <LinePath
              key={key}
              data={records}
              x={(d) => xScale(getDate(d)) ?? 0}
              y={(d) => yScale(accessor(d)) ?? 0}
              stroke={color}
              strokeWidth={2}
              curve={curveMonotoneX}
            />
          ))}

          {/* Axes */}
          <AxisBottom
            top={chartHeight}
            scale={xScale}
            numTicks={6}
            stroke="#999"
            tickStroke="#999"
            tickLabelProps={() => ({
              fill: "#666",
              fontSize: 11,
              textAnchor: "middle",
            })}
          />

          <AxisLeft
            scale={yScale}
            stroke="#999"
            tickStroke="#999"
            tickLabelProps={() => ({
              fill: "#666",
              fontSize: 11,
              textAnchor: "end",
              dx: -4,
            })}
            label={yLabel}
            labelProps={{
              fill: "#c5c2bdff",
              fontSize: 12,
              textAnchor: "middle",
            }}
          />

          {/* Legend */}
          {lines.map(({ label, color }, i) => (
            <Group key={label} left={chartWidth + 10} top={i * 20}>
              <line
                x1={0}
                y1={10}
                x2={25}
                y2={10}
                stroke={color}
                strokeWidth={2}
              />
              <text x={30} y={10} dy="0.35em" fill="#c5c2bdff" fontSize={12}>
                {label}
              </text>
            </Group>
          ))}
        </Group>
      </svg>
    </Box>
  );

  return (
    <Flex flexDirection="column" p={4}>
      {/* Particulate Matter Chart */}

      <Chart
        title="Particulate Matter"
        yLabel="Concentration (µg/m³)"
        yScale={pmScale}
        lines={[
          {
            key: "pm25",
            label: "PM2.5",
            accessor: (d) => d.pm2_5,
            color: "#947166",
          },
          {
            key: "pm10",
            label: "PM10",
            accessor: (d) => d.pm10,
            color: "#FF7D00",
          },
        ]}
      />

      {/* Gas Pollutants Chart */}
      <Chart
        title="Gas Pollutants"
        yLabel="Concentration (mV)"
        yScale={gasScale}
        lines={[
          {
            key: "no2",
            label: "NO₂",
            accessor: (d) => d.no2_we,
            color: "#31BFD5",
          },
          {
            key: "ox",
            label: "O₃",
            accessor: (d) => d.ox_we,
            color: "#B700FF",
          },
        ]}
      />
    </Flex>
  );
};

export default LineGraph;
