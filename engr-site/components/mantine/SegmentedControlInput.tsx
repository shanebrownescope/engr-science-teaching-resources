import { SegmentedControl } from "@mantine/core";
import classes from "./SegmentedControlInput.module.css";
import { FormattedData } from "@/utils/formatting";

type SegmentedControlInputProps = {
  value: string;
  onChange: (value: string) => void;
  data: FormattedData[];
};

/**
 * Renders a segmented control input. Used on the module page.
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - The value of the input.
 * @param {(value: string) => void} props.onChange - The function to call when the value changes.
 * @param {FormattedData[]} props.data - The data to display in the control.
 * @returns {JSX.Element} - The rendered SegmentedControlInput component.
 */
export function SegmentedControlInput({
  value,
  onChange,
  data,
}: SegmentedControlInputProps) {
  const dataArray = data.map((item: FormattedData) => item.name);
  return (
    <SegmentedControl
      radius="xl"
      size="md"
      value={value} // Controlled component
      onChange={onChange} // Handle change
      data={dataArray}
      classNames={classes}
    />
  );
}
