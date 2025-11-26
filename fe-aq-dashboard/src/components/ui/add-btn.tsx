import {
  Button,
  Container,
  Text,
  Dialog,
  Portal,
  CloseButton,
  Stack,
  Input,
  Fieldset,
} from "@chakra-ui/react";
import "../../App.css";
const AddSensorBtn = () => {
  const handleNewSensorSubmit = () => {
    console.log("new sensor form submitted");
    // fill in once sensor network infrastructure is established
  };
  return (
    <Container>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button className="button-sml">
            <Text>
              Sensor <span style={{ fontSize: "1.5em" }}>⊕</span>
            </Text>
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title style={{ fontFamily: "Josefin Sans" }}>
                  Add your new sensor
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Body>
                  <Stack gap={4}>
                    <Fieldset.Root>
                      <Fieldset.Legend style={{ fontFamily: "Josefin Sans" }}>
                        Sensor Name
                      </Fieldset.Legend>
                      <Input placeholder="Brooklyn Tech Rooftop" />
                    </Fieldset.Root>

                    <Fieldset.Root>
                      <Fieldset.Legend style={{ fontFamily: "Josefin Sans" }}>
                        Sensor Address
                      </Fieldset.Legend>
                      <Input placeholder="123 Main St, Brooklyn, NY" />
                    </Fieldset.Root>

                    <Fieldset.Root>
                      <Fieldset.Legend style={{ fontFamily: "Josefin Sans" }}>
                        Placement Height (ft)
                      </Fieldset.Legend>
                      <Input type="number" placeholder="50" />
                    </Fieldset.Root>

                    <Fieldset.Root>
                      <Fieldset.Legend style={{ fontFamily: "Josefin Sans" }}>
                        Sensor ID
                      </Fieldset.Legend>
                      <Input placeholder="ind_4" />
                    </Fieldset.Root>

                    <Button
                      className="button"
                      mt={4}
                      onClick={handleNewSensorSubmit}
                    >
                      Submit
                    </Button>
                  </Stack>
                </Dialog.Body>
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
      </Dialog.Root>
    </Container>
  );
};
export default AddSensorBtn;
