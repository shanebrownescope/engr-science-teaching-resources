"use client";
import { Card, Image, Text, Group, Button } from "@mantine/core";
import classes from "./ModuleCard.module.css";
import Link from "next/link";

type ModuleCardProps = {
  title: string;
  description?: string;
  href: string;
};

/**
 * Renders a module card.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The module title.
 * @param {string} props.description - The module description.
 * @param {string} props.href - The module href.
 * @returns {JSX.Element} - The rendered ModuleCard component.
 */
export function ModuleCard({ title, description, href }: ModuleCardProps) {
  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Group justify="space-between" mt="xl">
        <Text fz="lg" fw={700} className={classes.title}>
          {title}
        </Text>
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        {description && description}
      </Text>
      <Link href={href} passHref legacyBehavior>
        <Button component="a" className="button--primary">
          View all
        </Button>
      </Link>
    </Card>
  );
}
