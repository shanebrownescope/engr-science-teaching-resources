import { RangeSlider } from "@mantine/core";
import classes from "./YearSlider.module.css";

export function YearSlider() {
  return (
    <RangeSlider labelAlwaysOn defaultValue={[89, 120]} classNames={classes} />
  );
}
