import { Container } from "@chakra-ui/react";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";

interface AQIMeterProps {
  width: number;
  height: number;
  currentValue: number;
}

const AQIMeter: React.FC<AQIMeterProps> = ({
  width,
  height,
  currentValue = 100,
}) => {
  // AQI color thresholds
  const aqiColors = [
    { value: 0, color: "#009966" }, // Good
    { value: 50, color: "#ffde33" }, // Moderate
    { value: 100, color: "#ff9933" }, // Unhealthy for sensitive
    { value: 150, color: "#cc0033" }, // Unhealthy
    { value: 200, color: "#660099" }, // Very unhealthy
    { value: 300, color: "#7e0023" }, // Hazardous
  ];

  const margin = { top: 20, right: 30, left: 40, bottom: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const radius = Math.min(innerWidth, innerHeight) / 2;
  const innerRadius = radius - 50;
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  // Create scale for color interpolation
  const colorScale = scaleLinear({
    domain: aqiColors.map((d) => d.value),
    range: aqiColors.map((d) => d.color),
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
    <Container>
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

          {/* Tick marks and labels */}
          {ticks.map((tick) => {
            const angle = -startAngle + (tick / maxAQI) * totalAngle - 11;
            const labelRadius = radius + 20;
            const x = Math.cos(angle) * labelRadius;
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
          <circle cx={0} cy={5} r={innerRadius - 25} fill="#009966" />
        </Group>
      </svg>
    </Container>
  );
};

export default AQIMeter;
