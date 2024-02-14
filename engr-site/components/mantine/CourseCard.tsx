import { Card, Image, Text, Group, RingProgress, Button } from "@mantine/core";
import classes from "./CourseCard.module.css";
import Link from "next/link";

export function CourseCard() {
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
      <Link href="/lectures/1d-motion">
        <Button>View all</Button>
      </Link>
    </Card>
  );
}
