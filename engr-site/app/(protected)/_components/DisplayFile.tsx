import { 
  Container, 
  Text, 
  Group, 
  Badge, 
  Rating, 
  Stack, 
  Divider,
  Paper,
  Title,
  Box,
  Tooltip
} from "@mantine/core";
import { IconCalendar, IconUser, IconFile, IconTag, IconFileDescription } from "@tabler/icons-react";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";
import { FetchedFile } from "@/utils/types_v2";
import classes from "./DisplayFileLink.module.css"; // Create this CSS module

type DisplayFileProps = {
  file: FetchedFile;
};

export const DisplayFile = ({ file }: DisplayFileProps) => {
  const formattedDate = new Date(file.uploadDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Container size="xl" py="md">
      <Paper withBorder radius="md" p="md" className={classes.resourceContainer}>
        <Stack gap="sm">
          {/* Metadata Section */}
          <Group justify="space-between" wrap="nowrap">
            <Tooltip label="Resource type">
              <Group gap="xs">
                <IconFileDescription size={16} />
                <Text size="sm">{trimCapitalizeFirstLetter(file.resourceType)}</Text>
              </Group>
            </Tooltip>

            <Tooltip label="Contributor">
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm">{file.contributor || "Anonymous"}</Text>
              </Group>
            </Tooltip>

            <Tooltip label="Upload Date">
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{formattedDate}</Text>
              </Group>
            </Tooltip>
          </Group>

          {/* Rating Section */}
          {file.avgRating && (
            <Group gap="xs">
              <Rating value={file.avgRating} fractions={4} readOnly size="sm" />
              <Text size="sm">
                {file.avgRating}/5
              </Text>
            </Group>
          )}

          <Divider my="sm" />

          {/* File Preview */}
          <Box className={classes.iframeContainer}>
            <iframe
              src={file.s3Url}
              className={classes.iframe}
              title={"Resource preview"}
            />
          </Box>

          {/* Tags Section */}
          <Stack gap="xs">
            {file.tags?.length > 0 && (
              <div>
                <Title order={5} mb={4}>
                  <Group gap={4}>
                    <IconTag size={16} />
                    Tags
                  </Group>
                </Title>
                <Group gap={4}>
                  {file.tags.map((tag, index) => (
                    typeof tag === 'string' && (
                      <Badge key={index} variant="light" radius="sm">
                        {tag}
                      </Badge>
                    )
                  ))}
                </Group>
              </div>
            )}

            {file.courses?.length > 0 && (
              <div>
                <Title order={5} mb={4}>Relevant Courses</Title>
                <Group gap={4}>
                  {file.courses.map((course, index) => (
                    typeof course === 'string' && (
                      <Badge key={index} variant="default" color="dark" radius="sm">
                        {course}
                      </Badge>
                    )
                  ))}
                </Group>
              </div>
            )}

            {file.courseTopics?.length > 0 && (
              <div>
                <Title order={5} mb={4}>Course Topics</Title>
                <Group gap={4}>
                  {file.courseTopics.map((topic, index) => (
                    typeof topic === 'string' && (
                      <Badge key={index} variant="default" color="indigo" radius="sm">
                        {topic}
                      </Badge>
                    )
                  ))}
                </Group>
              </div>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};