"use client";
import { Card, Image, Text, Group, Button } from "@mantine/core";
import classes from "./CourseCard.module.css";
import Link from "next/link";

type CourseCardProps = {
  title: string;
  description?: string;
  href: string;
};

/**
 * Renders a card component for a course with title, description, and a link button.
 *
 * @param {CourseCardProps} props - The properties of the course card.
 * @param {string} props.title - The title of the course.
 * @param {string} props.description - The description of the course.
 * @param {string} props.href - The link to the course details page.
 * @returns {JSX.Element} - The rendered CourseCard component.
 */
export function CourseCard({ title, description, href }: CourseCardProps) {
  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Group justify="space-between" mt="xl">
        <Text fz="sm" fw={700} className={classes.title}>
          {title}
        </Text>
      </Group>
      {description &&
        <Text mt="sm" mb="md" c="dimmed" fz="xs">
          {description}
        </Text>
      }
      <Link href={href} passHref legacyBehavior>
        {/* TODO: Fix Button componen */}
        <Button component="a" className="button--primary">
          View
        </Button>
      </Link>
    </Card>
  );
}
