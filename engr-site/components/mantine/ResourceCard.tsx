import React from "react";
import { 
  Card, 
  Text, 
  Group, 
  Badge, 
  Rating, 
  Stack, 
  Divider,
  Tooltip
} from "@mantine/core";
import { IconCalendar, IconUser, IconFileDescription } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./ResourceCard.module.css";

type ResourceCardProps = {
  type: string;
  title: string;
  urlName: string;
  uploadDate: string;
  description: string;
  tags: string[];
  courses: string[];
  courseTopics: string[];
  resourceType: string;
  contributor: string;
  avgRating: number | null;
  numReviews: number;
};

export const ResourceCard = ({
  type,
  title,
  urlName,
  uploadDate,
  description,
  tags,
  courses,
  courseTopics,
  resourceType,
  contributor,
  avgRating,
  numReviews
}: ResourceCardProps) => {
  const formattedDate = new Date(uploadDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card 
      withBorder 
      radius="md" 
      className={classes.card}
      component={Link}
      href={`/resources/${type}/${urlName}`}
    >
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap">
          <Badge color={type === 'file' ? 'blue' : 'cyan'} variant="light" tt="capitalize">
            {type}
          </Badge>
          
          <Group gap="xs" wrap="nowrap">
            <Tooltip label="Upload date">
              <Group gap={4}>
                <IconCalendar size={14} />
                <Text size="sm">{formattedDate}</Text>
              </Group>
            </Tooltip>
          </Group>
        </Group>

        {title && (
          <Text className={classes.title} fw={500} lineClamp={1}>
            {title}
          </Text>
        )}

        {description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {description}
          </Text>
        )}

        <Group gap="xs" wrap="nowrap">
          <Tooltip label="Contributor">
            <Group gap={4}>
              <IconUser size={14} />
              <Text size="sm" lineClamp={1}>{contributor}</Text>
            </Group>
          </Tooltip>

          <Tooltip label="Resource type">
            <Group gap={4}>
              <IconFileDescription size={14} />
              <Text size="sm" lineClamp={1}>{resourceType}</Text>
            </Group>
          </Tooltip>
        </Group>

        {avgRating ? (
          <Group gap="xs">
            <Rating value={avgRating} fractions={4} readOnly size="sm" />
            <Text size="sm">
              {avgRating} ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
            </Text>
          </Group>
        ) : (
          <Text size="sm" c="dimmed">No reviews yet</Text>
        )}

        <Divider my="sm" />

        <Stack gap="xs">
          {tags.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb={4}>Tags</Text>
              <div className={classes.tagGroup}>
                {tags.map((tag, index) => (
                  <Badge key={index} variant="light" radius="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {courses.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb={4}>Relevant Courses</Text>
              <div className={classes.tagGroup}>
                {courses.map((course, index) => (
                  <Badge key={index} variant="default" color="dark" radius="sm">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {courseTopics.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb={4}>Relevant Course Topics</Text>
              <div className={classes.tagGroup}>
                {courseTopics.map((topic, index) => (
                  <Badge key={index} variant="default" color="indigo" radius="sm">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};