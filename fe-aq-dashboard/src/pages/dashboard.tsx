import { Grid, GridItem, Text } from "@chakra-ui/react";
import { useState } from "react";
import AQIMeter from "../components/ui/dashboard-ui/aqi-meter";
const DashboardPage = () => {
  const [healthMsg, setHealthMsg] = useState("");
  const handleHealthAdvMsg = (msg: string) => {
    console.log(msg);
    setHealthMsg(msg);
  };
  return (
    <Grid templateColumns={"repeat(2, 1fr)"} justifyContent={"center"}>
      <GridItem colSpan={1} textAlign={"center"}>
        <AQIMeter
          width={700}
          height={700}
          currentValue={100}
          handleHealthAdvMsg={handleHealthAdvMsg}
        />
        <Text
          border={"2px solid #FFECD1"}
          borderRadius={"24px"}
          w={"50%"}
          m={"auto"}
          p={5}
        >
          {healthMsg}
        </Text>
      </GridItem>
      <GridItem colSpan={1} textAlign={"center"}></GridItem>
    </Grid>
  );
};

export default DashboardPage;
