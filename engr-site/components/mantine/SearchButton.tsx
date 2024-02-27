import React from "react";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import classes from "./HeaderMegaMenu.module.css";

export function SearchButton(props: TextInputProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      className="searchInput" // Apply custom class for width adjustment
      radius="xl"
      size="md"
      placeholder="Search questions, modules, and more"
      rightSectionWidth={42}
      leftSection={<IconSearch className="iconStyle" stroke={1.5} />}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
        >
          <IconArrowRight className="iconStyle" stroke={1.5} />
        </ActionIcon>
      }
      {...props}
    />
  );
}
