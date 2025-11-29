import { Grid, GridItem, Text } from "@chakra-ui/react";
import AQIMeter from "../components/ui/dashboard-ui/aqi-meter";
const DashboardPage = () => {
  return (
    <Grid templateColumns={"repeat(2, 1fr)"} justifyContent={"center"}>
      <GridItem colSpan={1} textAlign={"center"}>
        <AQIMeter width={600} height={600} currentValue={200} />
        <Text>Add health advisory message</Text>
      </GridItem>
      <GridItem colSpan={1} textAlign={"center"}>
        <AQIMeter width={600} height={600} currentValue={200} />
        <Text>Add health advisory message</Text>
      </GridItem>
    </Grid>
  );
};

export default DashboardPage;
