"use client";
import { Card, Image, Text, Group, Button } from "@mantine/core";
import classes from "./CourseCard.module.css";
import Link from "next/link";

type CourseCardProps = {
  title: string;
  description: string;
  href: string;
};

export function CourseCard({ title, description, href }: CourseCardProps) {
  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Group justify="space-between" mt="xl">
        <Text fz="sm" fw={700} className={classes.title}>
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
