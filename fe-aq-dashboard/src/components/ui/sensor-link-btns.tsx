import { Button, HStack } from "@chakra-ui/react";

const SensorLinkBtns = () => {
  return (
    <HStack justifyContent={"center"}>
      <Button className="jump-to-location-btn">Jump to location</Button>
      <Button className="go-to-dashboard-btn"> Dashboard</Button>
    </HStack>
  );
};

export default SensorLinkBtns;
