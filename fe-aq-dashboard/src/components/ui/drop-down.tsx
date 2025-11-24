import { Portal, Select, createListCollection } from "@chakra-ui/react";
import "../../App.css";

const DropdownComponent = () => {
  const frameworks = createListCollection({
    items: [
      { label: "Number of active sensors", value: "react" },
      { label: "Worst air quality", value: "vue" },
      { label: "Best air quality", value: "angular" },
    ],
  });

  return (
    <Select.Root collection={frameworks} size="sm" width="320px">
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger
          bg="#001524"
          borderColor="#FFECD1"
          borderWidth="2px"
          borderRadius="24px"
          color="#FFECD1"
          px={6}
          py={3}
        >
          <Select.ValueText placeholder="Sort by ⌄" />
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content bg="#001524" borderColor="#FFECD1" borderWidth="1px">
            {frameworks.items.map((framework) => (
              <Select.Item
                item={framework}
                key={framework.value}
                color="#FFECD1"
                _hover={{ bg: "#15616D" }}
              >
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default DropdownComponent;
