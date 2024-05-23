"use client";
import { Card, Image, Text, Group, Button } from "@mantine/core";
import classes from "./ModuleCard.module.css";
import Link from "next/link";

/**
 * Renders a module card.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The module title.
 * @param {string} props.description - The module description.
 * @param {string} props.href - The module href.
 * @returns {JSX.Element} - The rendered ModuleCard component.
 */
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
