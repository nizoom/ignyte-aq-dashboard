import React, { useState } from "react";
import { Box, Button, Grid, Text, Stack } from "@chakra-ui/react";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  startDate = new Date(2024, 7, 1), // Aug 1, 2024
  endDate = new Date(2024, 10, 29), // Nov 29, 2024
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 7, 1));

  // Dark mode color palette
  const colors = {
    darkNavy: "#001524",
    darkBrown: "#78290F",
    orange: "#FF7D00",
    cream: "#FFECD1",
    teal: "#15616D",
  };

  const daysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInRange = (date: Date): boolean => {
    return date >= startDate && date <= endDate;
  };

  const handleDateClick = (day: number): void => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateInRange(clickedDate)) {
      onDateChange(clickedDate);
      setIsOpen(false);
    }
  };

  const handlePrevMonth = (): void => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    if (
      newMonth >= new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    ) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = (): void => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    if (newMonth <= new Date(endDate.getFullYear(), endDate.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const renderCalendar = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} />);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isInRange = isDateInRange(date);
      const isSelected =
        selectedDate !== null &&
        date.toDateString() === selectedDate.toDateString();

      days.push(
        <Button
          key={day}
          size="sm"
          bg={isSelected ? colors.orange : "transparent"}
          color={
            isSelected ? colors.darkNavy : isInRange ? colors.cream : "gray.600"
          }
          _hover={{
            bg: isSelected
              ? colors.orange
              : isInRange
              ? colors.teal
              : "transparent",
          }}
          disabled={!isInRange}
          onClick={() => handleDateClick(day)}
          w="100%"
          h="40px"
          fontWeight={isSelected ? "bold" : "normal"}
          opacity={isInRange ? 1 : 0.3}
          borderRadius="md"
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const canGoPrev =
    currentMonth > new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const canGoNext =
    currentMonth < new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  return (
    <Box position="relative" display="flex" justifyContent="center">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        bg={colors.teal}
        color={colors.cream}
        _hover={{ bg: colors.darkBrown }}
        minW="200px"
        borderRadius="md"
      >
        📅 {formatDate(selectedDate)}
      </Button>

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left="50%"
          transform="translateX(-50%)"
          mt={2}
          bg={colors.darkNavy}
          borderRadius="md"
          boxShadow="xl"
          p={4}
          w="320px"
          zIndex={1000}
        >
          <Stack gap={4}>
            {/* Month Navigation */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                size="sm"
                bg={colors.teal}
                color={colors.cream}
                _hover={{ bg: colors.darkBrown }}
                onClick={handlePrevMonth}
                disabled={!canGoPrev}
                borderRadius="md"
              >
                ←
              </Button>
              <Text fontWeight="bold" fontSize="md" color={colors.cream}>
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </Text>
              <Button
                size="sm"
                bg={colors.teal}
                color={colors.cream}
                _hover={{ bg: colors.darkBrown }}
                onClick={handleNextMonth}
                disabled={!canGoNext}
                borderRadius="md"
              >
                →
              </Button>
            </Box>

            {/* Day Headers */}
            <Grid templateColumns="repeat(7, 1fr)" gap={1} w="100%">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <Text
                  key={day}
                  textAlign="center"
                  fontSize="xs"
                  fontWeight="bold"
                  color={colors.orange}
                >
                  {day}
                </Text>
              ))}
            </Grid>

            {/* Calendar Grid */}
            <Grid templateColumns="repeat(7, 1fr)" gap={1} w="100%">
              {renderCalendar()}
            </Grid>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

// Example usage component
const DatePickerDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const colors = {
    darkNavy: "#001524",
    darkBrown: "#78290F",
    orange: "#FF7D00",
    cream: "#FFECD1",
    teal: "#15616D",
  };

  return (
    <Stack gap={4} p={8} bg={colors.darkNavy} minH="100vh">
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Display Selected Date */}
      {selectedDate && (
        <Box p={4} bg={colors.teal} borderRadius="md" w="300px" mx="auto">
          <Text fontSize="sm" color={colors.cream}>
            Selected Date:
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={colors.cream}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
          <Text fontSize="xs" color={colors.cream} mt={2} opacity={0.8}>
            ISO: {selectedDate.toISOString()}
          </Text>
        </Box>
      )}
    </Stack>
  );
};

export default DatePicker;
