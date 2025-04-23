"use client";

import { Rating, Text, Group, Paper, Stack, Divider, Avatar } from '@mantine/core';
import classes from './ReviewBox.module.css'; // Create this CSS module for custom styles

type ReviewBoxProps = {
    rating: number;
    title: string;
    comments: string;
    userPublicName: string;
    uploadDate: string;
};

export function ReviewBox({ 
    rating,
    title,
    comments,
    userPublicName,
    uploadDate
}: ReviewBoxProps) {

  return (
    <Paper withBorder p="md" radius="md" className={classes.reviewCard}>
        <Stack gap="xs">
            <Group justify="space-between">
                <Group>
                    <Avatar color="blue" radius="xl" size="md">
                        {userPublicName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text fw={500}>{userPublicName}</Text>
                </Group>
                <Text c="dimmed" size="sm">
                    {uploadDate}
                </Text>
            </Group>

            <Rating value={rating} fractions={2} readOnly />

            <Text fw={600} size="lg">
                {title}
            </Text>

            <Text className={classes.reviewBody}>{comments}</Text>
        </Stack>
    </Paper>
    );
}