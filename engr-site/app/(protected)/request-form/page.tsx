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
import { submitRequest, RequestFormData } from "@/actions/requests/submitRequest";
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';

export default function RequestForm() {
  const [courses, setCourses] = useState<FormattedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 移除独立的 note 状态，改为在 useForm 中管理
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      description: "",
      course: "",
      note: "", // 添加 note 字段
    },
    validate: {
      name: (value) => value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
      email: (value) => !/^\S+@\S+$/.test(value) ? 'Invalid email' : null,
      description: (value) => value.trim().length === 0 ? 'Description is required' : null,
      course: (value) => !value ? 'Please select a course' : null,
    },
  });

  // 获取课程数据
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses();
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    
    loadCourses();
  }, []);
  
  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await submitRequest(values);
      
      if (result.success) {
        setSuccess(result.success);
        form.reset(); // 重置表单
      } else if (result.error) {
        setError(result.error);
      } else if (result.failure) {
        setError(result.failure);
      }
    } catch (err) {
      setError('An error occurred while submitting your request. Please try again later.');
      console.error(err);
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
          mb="md"
        >
          External Faculty Request Form
        </Title>

        {/* Add Notes below the Title */}
        <Box mb="xl">
          <Text ta="center" c="dimmed" size="sm">
          If you would like to share teaching materials with us and have them featured on our website,{'\n'}
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
