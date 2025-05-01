"use client";
import React, { useEffect, useState, KeyboardEvent } from "react";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import classes from "./SearchButton.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [inputValue, setInputValue] = useState(props.value?.toString() || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  };

  const performSearch = () => {
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <TextInput
      className="searchInput" // Apply custom class for width adjustment
      radius="xl"
      size="md"
      placeholder="Search questions, modules, and more"
      rightSectionWidth={42}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      leftSection={<IconSearch className="iconStyle" stroke={1.5} />}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
          onClick={performSearch}
          component={Link}
          href={`/search?q=${encodeURIComponent(inputValue.trim())}`}
        >
          <IconArrowRight className="iconStyle" stroke={1.5} />
        </ActionIcon>
      }
    />
  );
}