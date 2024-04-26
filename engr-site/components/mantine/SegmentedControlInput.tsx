import { SegmentedControl } from "@mantine/core";
import classes from "./SegmentedControlInput.module.css";
import { FormattedData } from "@/utils/formatting";

type SegmentedControlInputProps = {
  value: string;
  onChange: (value: string) => void;
  data: FormattedData[];
};

export function SegmentedControlInput({ value, onChange, data }: SegmentedControlInputProps) {
  const dataArray = data.map((item: FormattedData) => (item.name));
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
