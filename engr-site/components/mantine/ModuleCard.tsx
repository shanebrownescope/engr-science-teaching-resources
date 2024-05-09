"use client";
import { Card, Image, Text, Group, Button } from "@mantine/core";
import classes from "./ModuleCard.module.css";
import Link from "next/link";

export function ModuleCard({ title, description, href }) {
  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Group justify="space-between" mt="xl">
        <Text fz="lg" fw={700} className={classes.title}>
          {title}
        </Text>
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        {description}
      </Text>
      <Link href={href} passHref>
        <Button component="a">View</Button>
      </Link>
    </Card>
  );
}
