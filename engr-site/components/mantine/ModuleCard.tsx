"use client";
import { Card, Image, Text, Group, Button } from "@mantine/core";
import classes from "./ModuleCard.module.css";
import Link from "next/link";

type ModuleCardProps = {
  title: string;
  description: string;
  href: string;
};

export function ModuleCard({ title, description, href }: ModuleCardProps) {
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
      <Link href={href} passHref legacyBehavior>
        <Button component="a" className="button--primary">
          View all
        </Button>
      </Link>
    </Card>
  );
}
