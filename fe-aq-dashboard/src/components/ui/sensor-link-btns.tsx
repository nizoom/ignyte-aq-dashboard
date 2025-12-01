import { Button, HStack } from "@chakra-ui/react";
import { useMapStore } from "../../store";
import { Link } from "react-router-dom";

type SensorLinkBtnProps = {
  location_name: string;
  filename: string;
};

const SensorLinkBtns = ({ location_name, filename }: SensorLinkBtnProps) => {
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
      <Link to={"/dashboard"} state={{ sensorId: filename }}>
        <Button className="go-to-dashboard-btn"> Dashboard</Button>
      </Link>
    </HStack>
  );
};

export default SensorLinkBtns;
