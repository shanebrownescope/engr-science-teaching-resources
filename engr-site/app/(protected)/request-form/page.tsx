"use client";
import {
  TextInput,
  Textarea,
  SimpleGrid,
  Title,
  Button,
  Container,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { useEffect, useState } from "react";
import { FormattedData } from "@/utils/formatting";
import requireAuth from "@/actions/auth/requireAuth";

export default function RequestForm() {
  const [courses, setCourses] = useState<FormattedData[]>([]);

  useEffect(() => {
    const getCourses = async () => {
      const courseData = await fetchCourses();
      if (courseData.success) {
        setCourses(courseData.success);
      }
    };
    getCourses();
  }, []);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      description: "",
      course: "",
    },
    validate: {
      name: (value) => value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
      email: (value) => !/^\S+@\S+$/.test(value) ? 'Invalid email' : null,
      description: (value) => value.trim().length === 0 ? 'Description is required' : null,
      course: (value) => !value ? 'Please select a course' : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    // Here we would typically send the data to our backend
  });

  return (
    <Container size="md" my={40}>
      <form onSubmit={handleSubmit}>
        <Title
          order={2}
          size="h1"
          style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
          fw={900}
          ta="center"
          mb="xl"
        >
          Request Form for External Faculty
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
          <TextInput
            label="Name"
            placeholder="Your name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="your.email@university.edu"
            required
            {...form.getInputProps("email")}
          />
        </SimpleGrid>

        <Select
          label="Course"
          placeholder="Select a course"
          data={courses.map(course => ({
            value: course.id.toString(),
            label: course.name
          }))}
          required
          mb="md"
          {...form.getInputProps("course")}
        />

        <Textarea
          label="Description"
          placeholder="Please describe your request and how you plan to use the materials"
          minRows={5}
          maxRows={10}
          required
          {...form.getInputProps("description")}
        />

        <Button
          type="submit"
          mt="xl"
          size="md"
          fullWidth
        >
          Submit Request
        </Button>
      </form>
    </Container>
  );
}
