import { Button, HStack } from "@chakra-ui/react";

type SensorLinkBtnProps = {
  location: string;
  bounds: number[];
};

const SensorLinkBtns = ({}: SensorLinkBtnProps) => {
  return (
    <HStack justifyContent={"center"}>
      <Button className="jump-to-location-btn">Jump to location</Button>
      <Button className="go-to-dashboard-btn"> Dashboard</Button>
    </HStack>
  );
};

export default SensorLinkBtns;
