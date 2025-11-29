import { Grid } from "@chakra-ui/react";
import AQIMeter from "../components/ui/dashboard-ui/aqi-meter";
const DashboardPage = () => {
  return (
    <Grid>
      <AQIMeter width={500} height={600} currentValue={200} />
    </Grid>
  );
};

export default DashboardPage;
