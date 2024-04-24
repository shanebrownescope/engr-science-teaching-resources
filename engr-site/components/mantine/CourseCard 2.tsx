"use client";
import { Card, Image, Text, Group, Button } from "@mantine/core";
import classes from "./CourseCard.module.css";
import Link from "next/link";

export function CourseCard({ title, description, href }) {
  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Group justify="space-between" mt="xl">
        <Text fz="sm" fw={700} className={classes.title}>
          {title} {/* Use the title prop */}
        </Text>
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        {description} {/* Use the description prop */}
      </Text>
      <Link href={href} passHref>
        <Button component="a">View all</Button>
      </Link>
    </Card>
  );
}
