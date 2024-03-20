"use client";

import { CreateCourseSchema } from "@/schemas";
import { Group, Box } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import createCourse from "@/actions/create/createCourse";
import { useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

type FormFields = z.infer<typeof CreateCourseSchema>;

const Courses = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      courseName: "",
    },
    resolver: zodResolver(CreateCourseSchema), // Resolver for Zod schema validation
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
      const results = await createCourse(data);
      console.log(results);
      if (results.error) {
        setError("root", { message: results.error });
      }

      if (results.success) {
        setSuccess(results.success);
      }
    } catch (error) {
      setError("root", { message: "Error" });
      console.log(error);
    }
  };

  return (
    <Box maw={340} mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Course Name</label>
          <input
            {...register("courseName")}
            type="text"
            placeholder="Enter course name"
            disabled={isSubmitting}
          />
        </div>
        {errors.courseName && (
          <p className="error">{errors.courseName.message}</p>
        )}
        <Group justify="flex-end" mt="md">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </Group>
        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}
      </form>
    </Box>
  );
};

export default Courses;
