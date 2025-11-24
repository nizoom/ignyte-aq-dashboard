import { Button, HStack } from "@chakra-ui/react";
import { useMapStore } from "../../store";

type SensorLinkBtnProps = {
  location_name: string;
};

const SensorLinkBtns = ({ location_name }: SensorLinkBtnProps) => {
  console.log(location_name);
  const flyToLocation = useMapStore((state) => state.flyToLocation);
  const locations = useMapStore((state) => state.locations);

  return (
    <HStack justifyContent={"center"}>
      <Button
        className="jump-to-location-btn "
        onClick={() => flyToLocation(location_name)}
      >
        Jump to location
      </Button>
      <Button className="go-to-dashboard-btn"> Dashboard</Button>
    </HStack>
  );
};

export default SensorLinkBtns;
