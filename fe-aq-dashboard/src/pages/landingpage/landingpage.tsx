import landingbg from "../../assets/landing-bg.png";
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Dialog,
} from "@chakra-ui/react";
import SignInForm from "../../components/signin";
import "../../App.css";

const LandingPage = () => {
  return (
    <Stack>
      <Box
        bgImage={`url(${landingbg})`}
        bgSize="cover"
        bgRepeat="no-repeat"
        w="100%"
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        pt={12}
        overflow={"hidden"}
        bgPos={"top"}
      >
        <Container
          maxW="container.lg"
          textAlign={"left"}
          w={"80%"}
          pl={0}
          ml={0}
        >
          <Heading
            size="7xl"
            style={{ fontFamily: "Josefin Slab", fontWeight: "400" }}
          >
            Urban Air Quality Dashboard
          </Heading>
          <Heading
            size="4xl"
            style={{ fontFamily: "Josefin Slab", fontWeight: "400" }}
          >
            Data visualization and analytics from low-cost autonomous air
            sensors
          </Heading>
          <Dialog.Root placement={"center"} motionPreset="slide-in-top">
            <Dialog.Trigger mt={20}>
              <Button className="button" p={5}>
                <Text textStyle={"xl"}> Sign in </Text>
              </Button>
            </Dialog.Trigger>
            <SignInForm />
          </Dialog.Root>
        </Container>
      </Box>
      <Text pos="absolute" bottom={20} right={10} mb={0} textStyle={"xl"}>
        {" "}
        By IgNYte Lab
      </Text>
    </Stack>
  );
};

export default LandingPage;
