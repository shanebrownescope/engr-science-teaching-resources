import { SegmentedControl } from "@mantine/core";
import classes from "./SegmentedControlInput.module.css";

export function SegmentedControlInput() {
  return (
    <SegmentedControl
      radius="xl"
      size="md"
      data={["Problems", "Course Notes", "Quizzes", "Exams", "Videos"]}
      classNames={classes}
    />
  );
}
