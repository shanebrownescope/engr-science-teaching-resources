"use client";
import { useState, useEffect } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./ModuleContentTable.module.css";

interface ModuleContent {
  name: string;
  description: string; // Assuming files and links both have descriptions now
  tags: string[]; // Assuming the 'tags' field is an array of strings
}

interface ModuleContentTableProps {
  files: ModuleContent[];
  links: ModuleContent[];
}

interface RowData {
  name: string;
  creator: string;
  dateUploaded: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
  width?: string;
}

function Th({ children, reversed, sorted, onSort, width }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th} style={{ width }}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

// Combined filter and sort function for the new data structure
function filterAndSortData(
  data: ModuleContent[],
  search: string,
  sortBy: keyof ModuleContent | null,
  reverseSortDirection: boolean
): ModuleContent[] {
  let filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.join(", ").toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy) {
    filteredData.sort((a, b) => {
      const aValue = a[sortBy],
        bValue = b[sortBy];
      const comparison = aValue.localeCompare(bValue);
      return reverseSortDirection ? -comparison : comparison;
    });
  }

  return filteredData;
}

export function ModuleContentTable({ files, links }: ModuleContentTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof ModuleContent | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [displayedData, setDisplayedData] = useState<ModuleContent[]>([]);

  useEffect(() => {
    // Combine files and links into a single array and then filter and sort
    const combinedData = [...files, ...links];
    const updatedData = filterAndSortData(
      combinedData,
      search,
      sortBy,
      reverseSortDirection
    );
    setDisplayedData(updatedData);
  }, [files, links, search, sortBy, reverseSortDirection]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by name, description, or tags"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs">
        <thead>
          <Table.Tr>
            <Th
              width="25%"
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSortBy("name")}
            >
              Name
            </Th>
            <Th
              width="50%"
              sorted={sortBy === "description"}
              reversed={reverseSortDirection}
              onSort={() => setSortBy("description")}
            >
              Description
            </Th>
            <Table.Th className={`${classes.tagsColumn}`}>
              <Text fw={500} fz="sm">
                Tags
              </Text>
            </Table.Th>
          </Table.Tr>
        </thead>
        <Table.Tbody>
          {displayedData.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.description}</Table.Td>
              <Table.Td>{item.tags.join(", ")}</Table.Td>
            </Table.Tr>
          ))}
          {displayedData.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={3} style={{ textAlign: "center" }}>
                No content found
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
