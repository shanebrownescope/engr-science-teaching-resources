import { SegmentedControl } from "@mantine/core";
import classes from "./SegmentedControlInput.module.css";

export function SegmentedControlInput({ value, onChange }) {
  return (
    <SegmentedControl
      radius="xl"
      size="md"
      value={value} // Controlled component
      onChange={onChange} // Handle change
      data={["Problems", "Course Notes", "Quizzes", "Exams", "Videos"]}
      classNames={classes}
    />
  );
}
