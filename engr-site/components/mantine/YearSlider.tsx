import { RangeSlider } from "@mantine/core";
import classes from "./YearSlider.module.css";

/**
 * Renders a year slider.
 *
 * @returns {JSX.Element} - The rendered YearSlider component.
 */
export function YearSlider() {
  return (
    <RangeSlider labelAlwaysOn defaultValue={[89, 120]} classNames={classes} />
  );
}
