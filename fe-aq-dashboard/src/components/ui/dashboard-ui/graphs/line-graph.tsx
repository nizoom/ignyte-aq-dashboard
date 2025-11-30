import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";

interface Point {
  date: Date;
  value: number;
}

interface LineChartProps {
  width: number;
  height: number;
  data: Point[];
}

const LineGraph = ({ width, height, data }: LineChartProps) => {
  return <></>;
};

export default LineGraph;
