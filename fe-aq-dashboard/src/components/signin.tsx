import {
  Dialog,
  Button,
  Portal,
  CloseButton,
  Text,
  Stack,
  HStack,
} from "@chakra-ui/react";

const SignInForm = () => {
  return (
    <>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title textStyle={"xl"} className="text-sans">
                Sign In
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack>
                <Text textStyle={"lg"} className="text-sans">
                  Resident View
                </Text>

                <Text textStyle={"md"} ml={10} mb={0} className="text-sans">
                  A simple, easy-to-read view that shows current air quality,
                  and health guidance.
                </Text>
                <Button className="button-sml" ml={10} mb={5} mt={2.5}>
                  {" "}
                  Go
                </Button>
                <HStack alignContent={"center"}>
                  <Text textStyle={"lg"} className="text-sans">
                    Researcher View
                  </Text>
                </HStack>
                <Text textStyle={"md"} ml={10} className="text-sans">
                  Advanced view with data on particulate matter and gas
                  pollutants, and longer time series data for scientific
                  analysis.
                </Text>
                <Button className="button-sml" ml={10} mt={2.5}>
                  {" "}
                  Go
                </Button>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
      ;
    </>
  );
};

export default SignInForm;
