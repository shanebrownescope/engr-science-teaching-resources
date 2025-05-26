"use client";
import React, { useEffect, useState } from "react";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import classes from "./SearchButton.module.css";
import Link from "next/link";
import {
  lowercaseAndReplaceSpace,
  lowercaseAndReplaceSpaceString,
} from "@/utils/formatting";

/**
 * Renders a search button.
 *
 * @param {Object} props - The component props.
 * @returns {JSX.Element} - The rendered SearchButton component.
 */
export function SearchButton(props: TextInputProps) {
  const theme = useMantineTheme();

  // Use props.value if provided from parent, otherwise use internal state
  const [inputValue, setInputValue] = useState(props.value?.toString() || ""); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  return (
    <TextInput
      className="searchInput" // Apply custom class for width adjustment
      radius="xl"
      size="md"
      placeholder="Search questions, modules, and more"
      rightSectionWidth={42}
      value={inputValue}
      onChange={handleInputChange}
      leftSection={<IconSearch className="iconStyle" stroke={1.5} />}
      rightSection={
        <Link href={`/search?${new URLSearchParams({
          q: inputValue.trim()
        })}`}>
          <ActionIcon
            size={32}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
          >
            <IconArrowRight className="iconStyle" stroke={1.5} />
          </ActionIcon>
        </Link>
      }
    />
  );
}
