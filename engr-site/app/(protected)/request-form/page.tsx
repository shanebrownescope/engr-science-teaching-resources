"use client";
import {
  TextInput,
  Textarea,
  SimpleGrid,
  Title,
  Button,
  Container,
  Select,
  Alert,
  Text,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { useEffect, useState } from "react";
import { FormattedData } from "@/utils/formatting";
import { RequestFormData } from "@/actions/requests/submitRequest";
import { submitExternalRequest } from "@/actions/requests/submitExternalRequest";
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function RequestForm() {
  useRequireAuth();
  
  const [courses, setCourses] = useState<FormattedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const courseData = await fetchCourses();
        if (courseData.success) {
          setCourses(courseData.success);
        } else {
          console.error("Failed to fetch courses:", courseData.failure || courseData.error);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
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
      email: (value) => value.trim().length === 0 ? 'Email is required' : null,
      description: (value) => value.trim().length === 0 ? 'Description is required' : null,
      course: (value) => !value ? 'Please select a course' : null,
    },
  });

  const handleSubmit = async (values: RequestFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formattedValues = {
        name: values.name.trim(),
        email: values.email.trim(),
        description: values.description.trim(),
        courseId: Number(values.course) 
      };
      
      console.log("Form data submitted:", formattedValues);
      
      if (isNaN(formattedValues.courseId)) {
        setError("Invalid course selection");
        setLoading(false);
        return;
      }
      
      const result = await submitExternalRequest(formattedValues);
      
      if (result.success) {
        setSuccess(result.success);
        form.reset();
      } else if (result.error) {
        console.error("Submission error:", result.error);
        setError(result.error);
      } else if (result.failure) {
        console.error("Submission failed:", result.failure);
        setError(result.failure);
      } else {
        setError('An unknown error occurred while submitting the request');
      }
    } catch (err) {
      console.error("Submission exception:", err);
      setError('An error occurred while submitting the request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" my={40}>
      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mb="md">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert icon={<IconCheck size="1rem" />} title="Success" color="green" mb="md">
          {success}
        </Alert>
      )}
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title
          order={2}
          size="h1"
          style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
          fw={900}
          ta="center"
          mb="xl"
        >
          External Faculty Request Form
        </Title>
        
        <Box mb="xl">
          <Text ta="center" c="dimmed" size="sm">
          If you would like to share teaching materials with us and have them featured on our website,
          please fill out this form, and we will get in touch with you as soon as possible.
          </Text>
        </Box>     
        
        <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
          <TextInput
            label="Name"
            placeholder="Your Name"
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
          loading={loading}
        >
          Submit Request
        </Button>
      </form>
    </Container>
  );
}
