import { Box } from "@chakra-ui/react";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { useEffect } from "react";

interface AQIMeterProps {
  width: number;
  height: number;
  currentValue: number;
  handleHealthAdvMsg: (msg: string) => void;
}

const AQIMeter: React.FC<AQIMeterProps> = ({
  width,
  height,
  currentValue = 200,
  handleHealthAdvMsg,
}) => {
  // AQI Pointer

  // converts scale to angle
  const angleScale = scaleLinear({
    domain: [0, 300],
    range: [0, 180],
  });
  // trial and error until the pointer lands in right place based on new angle calculation
  const angle = angleScale(currentValue) + 90;

  // fill color, msg, health advisory
  interface AqiInfo {
    value: number;
    color: string;
    meterMsg: string[];
    healthAdvisory: string;
  }

  const getMeterData = (currentValue: number): AqiInfo => {
    for (const [index, colorObj] of aqiColorInfo.entries()) {
      const next = aqiColorInfo[index + 1];

      if (!next) {
        // If there's no next segment, return the last color object if value is in or above this segment
        if (currentValue >= colorObj.value) return colorObj;
        continue;
      }
      const range = [colorObj.value, next.value];
      if (currentValue >= range[0] && currentValue <= range[1]) {
        return colorObj;
      }
    }
    // Fallback to the last object

    return aqiColorInfo[aqiColorInfo.length - 1];
  };

  useEffect(() => {
    const data = getMeterData(currentValue);
    handleHealthAdvMsg(data.healthAdvisory);
  }, [currentValue, handleHealthAdvMsg]);

  const getMeterMsg = () => {
    const meterMsgArray = getMeterData(currentValue).meterMsg;
    return Array.isArray(meterMsgArray) ? meterMsgArray : [meterMsgArray];
  };

  // AQI color thresholds
  const aqiColorInfo = [
    {
      // Good
      value: 0,
      color: "#009966",
      meterMsg: [`AQI: ${currentValue}`, "Good"],
      healthAdvisory: "It's a great day to be outside!",
    },
    {
      //Moderate
      value: 50,
      color: "#ffde33",
      meterMsg: [`AQI: ${currentValue}`, "Moderate"],
      healthAdvisory:
        "It's a good day to be active outside for the majority of people without health conditions.",
    },
    {
      // Unhealthy for sensitive
      value: 100,
      color: "#ff9933",
      meterMsg: [`AQI: ${currentValue}`, "Unhealthy for Sensitive Groups"],
      healthAdvisory: "Unhealthy for sensitive groups",
    },
    // Unhealthy for Sensitive Groups (AQI 101-150)
    {
      value: 150,
      color: "#ff9933", // Orange
      meterMsg: [`AQI: ${currentValue}`, "Unhealthy for Sensitive Groups"],
      healthAdvisory:
        "Active children and adults, and people with respiratory disease should limit prolonged outdoor exertion.",
    },
    // Unhealthy (AQI 151-200)
    {
      value: 200,
      color: "#cc0033", // Red
      meterMsg: [`AQI: ${currentValue}`, "Unhealthy"],
      healthAdvisory:
        "Sensitive Groups: Avoid all prolonged outdoor exertion; General Public: Limit prolonged outdoor exertion.",
    },
    // Very Unhealthy (AQI 201-300)
    {
      value: 300,
      color: "#660099", // Purple
      meterMsg: [`AQI: ${currentValue}`, "Very Unhealthy"],
      healthAdvisory:
        "Sensitive Groups: Avoid all outdoor physical activity; General Public: Avoid prolonged or heavy exertion.",
    },
    // Hazardous (AQI 301-500)
    {
      value: 500,
      color: "#7e0023", // Maroon
      meterMsg: [`AQI: ${currentValue}`, "Hazardous"],
      healthAdvisory:
        "Everyone should avoid all outdoor physical activity and remain indoors.",
    },
  ];

  const margin = { top: 200, right: 30, left: 30, bottom: 0 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const radius = Math.min(innerWidth, innerHeight) / 2;
  const innerRadius = radius - 40;
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  // Create scale for color interpolation
  const colorScale = scaleLinear({
    domain: aqiColorInfo.map((d) => d.value),
    range: aqiColorInfo.map((d) => d.color),
  });

  // Generate many thin arcs to simulate gradient
  const numSegments = 180; // More segments = smoother gradient
  const maxAQI = 300;
  const startAngle = -Math.PI / 2;
  const endAngle = Math.PI / 2;
  const totalAngle = endAngle - startAngle;

  const segments = Array.from({ length: numSegments }, (_, i) => {
    const aqiValue = (i / numSegments) * maxAQI;
    const segmentStartAngle = startAngle + (i / numSegments) * totalAngle;
    const segmentEndAngle = startAngle + ((i + 1) / numSegments) * totalAngle;

    return {
      startAngle: segmentStartAngle,
      endAngle: segmentEndAngle,
      color: colorScale(aqiValue),
      aqiValue: Math.round(aqiValue),
    };
  });

  // Major tick marks
  const ticks = [0, 50, 100, 150, 200, 300];

  return (
    <Box display={"inline-block"} textAlign={"center"}>
      <svg width={width} height={height}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          {/* Draw gradient segments */}
          {segments.map((segment, i) => (
            <Arc
              key={i}
              data={segment}
              startAngle={segment.startAngle}
              endAngle={segment.endAngle}
              outerRadius={radius}
              innerRadius={innerRadius}
              fill={segment.color}
            />
          ))}
          <g transform={`rotate(${angle})`}>
            {/* Triangle pointer */}
            <polygon
              points={`10,${innerRadius} -10,${innerRadius} 0,${
                innerRadius + 20
              }`}
              fill="#FFECD1"
              stroke="#FF7D00"
              strokeWidth={2}
            />
            {/* Center pivot circle */}
            <circle
              cx={0}
              cy={0}
              r={8}
              fill="#FF7D00"
              stroke="#FFECD1"
              strokeWidth={2}
            />
          </g>

          {/* Tick marks and labels */}
          {ticks.map((tick) => {
            const angle = -startAngle + (tick / maxAQI) * totalAngle - 11;
            const labelRadius = radius + 20;
            const x = Math.cos(angle) * labelRadius + 2;
            const y = Math.sin(angle) * labelRadius;

            // Adjust text anchor based on position
            let anchor: "end" | "middle" | "start" = "middle";
            if (angle < -Math.PI / 4) anchor = "end";
            if (angle > Math.PI / 4) anchor = "start";

            return (
              <text
                key={tick}
                x={x + 10}
                y={y}
                fill="white"
                fontSize={16}
                fontWeight="bold"
                textAnchor={anchor}
                dominantBaseline="middle"
              >
                {tick}
              </text>
            );
          })}
          <circle
            cx={0}
            cy={5}
            r={innerRadius - 25}
            fill={colorScale(currentValue)}
          />
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={currentValue > 40 && currentValue < 170 ? "black" : "white"}
            fontSize={20}
            fontWeight="bold"
            // stroke={currentValue > 40 && currentValue < 170 ? "black" : "white"}
            // strokeWidth={1}
            style={{ fontFamily: "Josefin Sans" }}
          >
            {getMeterMsg().map((line, i) => (
              <tspan key={i} x={0} dy={i === 0 ? 0 : "1.2em"}>
                {line}
              </tspan>
            ))}
          </text>
        </Group>
      </svg>
    </Box>
  );
};

export default AQIMeter;
