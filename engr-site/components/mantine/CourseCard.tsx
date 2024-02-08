import { Card, Image, Text, Group, RingProgress } from "@mantine/core";
import classes from "./CourseCard.module.css";

const stats = [
  { title: "Distance", value: "27.4 km" },
  { title: "Avg. speed", value: "9.6 km/h" },
  { title: "Score", value: "88/100" },
];

export function CourseCard() {
  const items = stats.map((stat) => (
    <div key={stat.title}>
      <Text size="xs" color="dimmed">
        {stat.title}
      </Text>
      <Text fw={500} size="sm">
        {stat.value}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Group justify="space-between" mt="xl">
        <Text fz="sm" fw={700} className={classes.title}>
          Module 1D Motion
        </Text>
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        Learn about 1D kinematics... and more
      </Text>
      <Card.Section className={classes.footer}>{items}</Card.Section>
    </Card>
  );
}
