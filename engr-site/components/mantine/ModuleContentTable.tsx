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
import Link from "next/link";

interface ModuleContent {
  type: string;
  originalName: string;
  urlName: string;
  description: string; // Assuming files and links both have descriptions now
  tags: string[]; // Assuming the 'tags' field is an array of strings
  id: number; // Assuming the 'id' field is a string
  dateAdded: string; // Assuming the 'uploadDate' field is a string
}

interface ModuleContentTableProps {
  files: ModuleContent[];
  links: ModuleContent[];
}

function Th({
  children,
  reversed,
  sorted,
  onSort,
  width,
}: {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  width?: string;
}) {
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

export function ModuleContentTable({ files, links }: ModuleContentTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof ModuleContent | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [displayedData, setDisplayedData] = useState<ModuleContent[]>([]);

  useEffect(() => {
    const combinedData = [...files, ...links];
    let filteredData = combinedData.filter(
      (item) =>
        item.originalName.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.join(", ").toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy) {
      filteredData.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        if (sortBy === "dateAdded") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return reverseSortDirection ? -comparison : comparison;
      });
    }
    setDisplayedData(filteredData);
  }, [files, links, search, sortBy, reverseSortDirection]);

  const handleSortChange = (sortField: keyof ModuleContent) => {
    if (sortField === sortBy) {
      setReverseSortDirection(!reverseSortDirection);
    } else {
      setSortBy(sortField);
      setReverseSortDirection(false);
    }
  };

  return (
    <ScrollArea className={classes.scrollAreaContainer}>
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
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs">
        <thead>
          <Table.Tr>
            <Th
              width="25%"
              sorted={sortBy === "originalName"}
              reversed={reverseSortDirection}
              onSort={() => handleSortChange("originalName")}
            >
              Name
            </Th>
            <Table.Th className={classes.descriptionColumn}>
              <Text fw={500} fz="sm">
                Description
              </Text>
            </Table.Th>
            <Table.Th className={classes.tagsColumn}>
              <Text fw={500} fz="sm">
                Tags
              </Text>
            </Table.Th>
            <Th
              sorted={sortBy === "dateAdded"}
              reversed={reverseSortDirection}
              onSort={() => handleSortChange("dateAdded")}
            >
              Date Added
            </Th>
          </Table.Tr>
        </thead>
        <Table.Tbody>
          {displayedData.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Link
                  href={`/resources/${item.type}/${
                    item.urlName
                  }?${new URLSearchParams({ id: item.id.toString() })}`}
                  passHref
                >
                  <p className={classes.linkStyle}>{item.originalName}</p>
                </Link>
              </Table.Td>
              <Table.Td>{item.description}</Table.Td>
              <Table.Td>
                {item.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={classes.tag}>
                    {tag}
                  </span>
                ))}
              </Table.Td>
              <Table.Td> {item.dateAdded} </Table.Td>
            </Table.Tr>
          ))}
          {displayedData.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={4} style={{ textAlign: "center" }}>
                No content found
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
