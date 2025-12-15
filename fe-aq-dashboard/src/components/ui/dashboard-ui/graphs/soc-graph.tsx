import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { curveMonotoneX } from "@visx/curve";
import { extent, bisector } from "d3-array";
import type { BatteryData, BatteryRecord } from "../../../../utils/types";
import { Box, Text } from "@chakra-ui/react";
import { localPoint } from "@visx/event";
import { useState } from "react";

interface BatteryLineGraphProps {
  width: number;
  height: number;
  data: BatteryData;
}

const BatteryLineGraph = ({ width, height, data }: BatteryLineGraphProps) => {
  const records = data.records;
  const margin = { top: 20, right: 40, bottom: 60, left: 60 }; // Increased bottom margin
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    soc: number;
    date: Date;
  } | null>(null);

  // Data accessors
  const getDate = (d: BatteryRecord) => new Date(d.timestamp);
  const getSOC = (d: BatteryRecord) => d.batt_soc;

  // Bisector for finding closest data point
  const bisectDate = bisector<BatteryRecord, Date>((d) => getDate(d)).left;

  // X scale (time)
  const xScale = scaleTime({
    domain: extent(records, getDate) as [Date, Date],
    range: [0, chartWidth],
  });

  // Y scale (SOC percentage)
  const yScale = scaleLinear({
    domain: [0, 100],
    range: [chartHeight, 0],
    nice: true,
  });

  // Format tick labels: "12/18 2p"
  const formatTick = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const ampm = hour >= 12 ? "p" : "a";
    const hour12 = hour % 12 || 12;

    return `${month}/${day} ${hour12}${ampm}`;
  };

  // Handle mouse move for tooltip
  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
    const point = localPoint(event);
    if (!point) return;

    const x0 = xScale.invert(point.x - margin.left);
    const index = bisectDate(records, x0, 1);
    const d0 = records[index - 1];
    const d1 = records[index];

    if (!d0 || !d1) return;

    const d =
      x0.getTime() - getDate(d0).getTime() >
      getDate(d1).getTime() - x0.getTime()
        ? d1
        : d0;

    setTooltipData({
      x: xScale(getDate(d)) ?? 0,
      y: yScale(getSOC(d)) ?? 0,
      soc: getSOC(d),
      date: getDate(d),
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  // Generate day/night rectangles
  const getDayNightRects = () => {
    if (records.length === 0) return [];

    const rects: Array<{ x: number; width: number; isDay: boolean }> = [];
    const startDate = getDate(records[0]);
    const endDate = getDate(records[records.length - 1]);

    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      // Night period: midnight to 6 AM
      const nightStart = new Date(currentDate);
      nightStart.setHours(0, 0, 0, 0);
      const nightEnd = new Date(currentDate);
      nightEnd.setHours(6, 0, 0, 0);

      if (nightEnd > startDate && nightStart < endDate) {
        const x =
          xScale(
            new Date(Math.max(nightStart.getTime(), startDate.getTime()))
          ) ?? 0;
        const endX =
          xScale(new Date(Math.min(nightEnd.getTime(), endDate.getTime()))) ??
          0;
        rects.push({ x, width: endX - x, isDay: false });
      }

      // Day period: 6 AM to 6 PM
      const dayStart = new Date(currentDate);
      dayStart.setHours(6, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(18, 0, 0, 0);

      if (dayEnd > startDate && dayStart < endDate) {
        const x =
          xScale(new Date(Math.max(dayStart.getTime(), startDate.getTime()))) ??
          0;
        const endX =
          xScale(new Date(Math.min(dayEnd.getTime(), endDate.getTime()))) ?? 0;
        rects.push({ x, width: endX - x, isDay: true });
      }

      // Night period: 6 PM to midnight
      const eveningStart = new Date(currentDate);
      eveningStart.setHours(18, 0, 0, 0);
      const eveningEnd = new Date(currentDate);
      eveningEnd.setHours(24, 0, 0, 0);

      if (eveningEnd > startDate && eveningStart < endDate) {
        const x =
          xScale(
            new Date(Math.max(eveningStart.getTime(), startDate.getTime()))
          ) ?? 0;
        const endX =
          xScale(new Date(Math.min(eveningEnd.getTime(), endDate.getTime()))) ??
          0;
        rects.push({ x, width: endX - x, isDay: false });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return rects;
  };

  const dayNightRects = getDayNightRects();

  return (
    <Box p={4}>
      {/* <Text fontSize="lg" fontWeight="600" mb={2} color="gray.400">
        Battery State of Charge
      </Text> */}
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Day/Night background shading */}
          {dayNightRects.map((rect, i) => (
            <rect
              key={i}
              x={rect.x}
              y={0}
              width={rect.width}
              height={chartHeight}
              fill={rect.isDay ? "#FFE5B4" : "#2C3E50"}
              opacity={rect.isDay ? 0.2 : 0.15}
            />
          ))}

          {/* Grid */}
          <GridRows
            scale={yScale}
            width={chartWidth}
            stroke="#e0e0e0"
            strokeOpacity={0.3}
          />

          {/* SOC Line */}
          <LinePath
            data={records}
            x={(d) => xScale(getDate(d)) ?? 0}
            y={(d) => yScale(getSOC(d)) ?? 0}
            stroke="#FF7D00"
            strokeWidth={3}
            curve={curveMonotoneX}
          />

          {/* Invisible rect for mouse events */}
          <rect
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />

          {/* Tooltip */}
          {tooltipData && (
            <g>
              {/* Vertical line */}
              <line
                x1={tooltipData.x}
                y1={0}
                x2={tooltipData.x}
                y2={chartHeight}
                stroke="#666"
                strokeWidth={1}
                strokeDasharray="4,4"
              />

              {/* Circle on line */}
              <circle
                cx={tooltipData.x}
                cy={tooltipData.y}
                r={5}
                fill="#FF7D00"
                stroke="white"
                strokeWidth={2}
              />

              {/* Tooltip box */}
              <g
                transform={`translate(${tooltipData.x}, ${tooltipData.y - 40})`}
              >
                <rect
                  x={-50}
                  y={0}
                  width={100}
                  height={35}
                  fill="rgba(0, 0, 0, 0.8)"
                  rx={4}
                />
                <text
                  x={0}
                  y={15}
                  textAnchor="middle"
                  fill="white"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {tooltipData.soc.toFixed(1)}%
                </text>
                <text
                  x={0}
                  y={28}
                  textAnchor="middle"
                  fill="white"
                  fontSize={10}
                >
                  {tooltipData.date.toLocaleString()}
                </text>
              </g>
            </g>
          )}

          {/* Axes */}
          <AxisBottom
            top={chartHeight}
            scale={xScale}
            numTicks={12}
            stroke="#999"
            tickStroke="#999"
            tickFormat={(value) => formatTick(value as Date)}
            tickLabelProps={() => ({
              fill: "#666",
              fontSize: 10,
              textAnchor: "middle",
              angle: -45,
              dx: -8,
              dy: 25,
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
            label="Battery SOC (%)"
            labelProps={{
              fill: "#c5c2bdff",
              fontSize: 12,
              textAnchor: "middle",
            }}
          />
        </Group>
      </svg>
    </Box>
  );
};

export default BatteryLineGraph;
