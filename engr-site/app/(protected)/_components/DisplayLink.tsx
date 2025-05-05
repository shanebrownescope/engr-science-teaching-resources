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
import { IconCalendar, IconUser, IconFile, IconTag, IconFileDescription, IconBook2, IconBook } from "@tabler/icons-react";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";
import { FetchedLink } from "@/utils/types_v2";
import classes from "./DisplayFileLink.module.css"; // Create this CSS module

type DisplayLinkProps = {
  link: FetchedLink;
};

export const DisplayLink = ({ link }: DisplayLinkProps) => {
  const formattedDate = new Date(link.uploadDate).toLocaleDateString('en-US', {
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
                <Text size="sm">{trimCapitalizeFirstLetter(link.resourceType)}</Text>
              </Group>
            </Tooltip>

            <Tooltip label="Contributor">
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm">{link.contributor || "Anonymous"}</Text>
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
          {link.avgRating && (
            <Group gap="xs">
              <Rating value={link.avgRating} fractions={4} readOnly size="sm" />
              <Text size="sm">
                {link.avgRating}/5
              </Text>
            </Group>
          )}

          <Divider my="sm" />

          <Box>
            <a href={link.linkUrl}>Visit Resource</a>
          </Box>

          {/* Tags Section */}
          <Stack gap="xs">
            {link.tags?.length > 0 && (
              <div>
                <Title order={5} mb={4}>
                  <Group gap={4}>
                    <IconTag size={16} />
                    Tags
                  </Group>
                </Title>
                <Group gap={4}>
                  {link.tags.map((tag, index) => (
                    typeof tag === 'string' && (
                      <Badge key={index} variant="light" radius="sm">
                        {tag}
                      </Badge>
                    )
                  ))}
                </Group>
              </div>
            )}

            {link.courses?.length > 0 && (
              <div>
                <Title order={5} mb={4}>
                  <Group gap={4}>
                    <IconBook2 size={16} />
                    Relevant Courses
                  </Group>
                </Title>
                <Group gap={4}>
                  {link.courses.map((course, index) => (
                    typeof course === 'string' && (
                      <Badge key={index} variant="default" color="dark" radius="sm">
                        {course}
                      </Badge>
                    )
                  ))}
                </Group>
              </div>
            )}

            {link.courseTopics?.length > 0 && (
              <div>
                <Title order={5} mb={4}>
                  <Group gap={4}>
                    <IconBook size={16} />
                    Relevant Course Topics
                  </Group>
                </Title>
                <Group gap={4}>
                  {link.courseTopics.map((topic, index) => (
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