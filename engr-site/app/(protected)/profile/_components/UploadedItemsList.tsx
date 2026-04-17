"use client";

import { Anchor, Badge, Table, Text, Title, Stack } from "@mantine/core";
import Link from "next/link";
import { FetchedFile, FetchedLink } from "@/utils/types_v2";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";
import styles from "./UploadedItemsList.module.css";

type Props = {
  files: FetchedFile[];
  links: FetchedLink[];
};

export const UploadedItemsList = ({ files, links }: Props) => {
  const hasUploads = files.length > 0 || links.length > 0;

  if (!hasUploads) {
    return (
      <Stack mt="xl">
        <Title order={3}>Your Uploads</Title>
        <Text c="dimmed">You have not uploaded any files or links yet.</Text>
      </Stack>
    );
  }

  return (
    <Stack mt="xl">
      <Title order={3}>Your Uploads</Title>

      {files.length > 0 && (
        <Stack gap="xs">
          <Title order={5}>Files ({files.length})</Title>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Resource Type</Table.Th>
                <Table.Th>Upload Date</Table.Th>
                <Table.Th>Courses</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {files.map((file) => (
                <Table.Tr key={file.id}>
                  <Table.Td>
                    <Badge variant="light" size="sm">
                      {trimCapitalizeFirstLetter(file.resourceType)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{file.uploadDate}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {file.courses?.filter(Boolean).join(", ") || "—"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Anchor component={Link} href={`/resources/file/${file.urlName}`} size="sm" className={styles.viewLink}>
                      View
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      )}

      {links.length > 0 && (
        <Stack gap="xs">
          <Title order={5}>Links ({links.length})</Title>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>URL</Table.Th>
                <Table.Th>Resource Type</Table.Th>
                <Table.Th>Upload Date</Table.Th>
                <Table.Th>Courses</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {links.map((link) => (
                <Table.Tr key={link.id}>
                  <Table.Td>
                    <Text size="sm" c="dimmed" truncate="end" maw={220}>
                      {link.linkUrl}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" size="sm" color="teal">
                      {trimCapitalizeFirstLetter(link.resourceType)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{link.uploadDate}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {link.courses?.filter(Boolean).join(", ") || "—"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Anchor component={Link} href={`/resources/link/${link.urlName}`} size="sm" className={styles.viewLink}>
                      View
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      )}
    </Stack>
  );
};
