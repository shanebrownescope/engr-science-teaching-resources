"use client";

import { CreateResourceTypeSchema } from "@/schemas";
import { Select } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormSelectProps } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import styles from "@/styles/form.module.css";
import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";
import createResourceType from "@/actions/create/createResourceType";
import { FormattedData } from "@/utils/formatting";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type FormFields = z.infer<typeof CreateResourceTypeSchema>;

const ResourceTypes = () => {
  useRequireAuth();

  const router = useRouter();
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
  const [courseList, setCourseList] = useState<FormSelectProps[]>([]);
  const [success, setSuccess] = useState<string | undefined>("");
  const [courseTopicOptions, setCourseTopicOptions] = useState<
    FormSelectProps[]
  >([]);
  console.log(courseList);

  useEffect(() => {
    const fetchAllCourses = async () => {
      const coursesOptionsData = await fetchCourses();
      console.log(coursesOptionsData.success);
      if (coursesOptionsData.success) {
        const formattedCourseList = coursesOptionsData.success.map(
          (course: FormattedData) => ({
            value: course.id.toString(),
            label: course.name,
          }),
        );
        setCourseList(formattedCourseList);
      }
    };

    fetchAllCourses();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      resourceTypeName: "",
      courseId: "",
      courseTopicId: "",
    },
    resolver: zodResolver(CreateResourceTypeSchema), // Resolver for Zod schema validation
  });

  const watchedValue = watch("resourceTypeName"); //
  console.log(watchedValue);

  const watchedValue2 = watch("courseId"); //
  console.log(watchedValue2);
  const watchedValue3 = watch("courseTopicId"); //
  console.log(watchedValue3);

  const handleCourseChange = async (selectedCourseId: string) => {
    setValue("courseTopicId", ""); // Clear moduleId value

    const results = await fetchCourseTopicsByCourseId(selectedCourseId);
    if (results?.success) {
      const formattedCourseTopicList = results.success.map(
        (topic: FormattedData) => ({
          value: topic.id.toString(),
          label: topic.name,
        }),
      );
      setCourseTopicOptions(formattedCourseTopicList);
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
      const results = await createResourceType(data);
      console.log(results);
      if (results.error) {
        console.log("here");
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
    <div className={styles.formWrapper}>
      <p className={styles.formAdminTitle}> Create Resource Type </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Resource type name</label>
          <Controller
            control={control}
            name="resourceTypeName"
            render={({ field }) => (
              <input
                className={errors.resourceTypeName && "input-error"}
                {...field}
                type="text"
                placeholder="Enter resource type name"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.resourceTypeName && (
            <p className="error">{errors.resourceTypeName.message}</p>
          )}
        </div>

        <div className="flex-col">
          <label> Enter Course</label>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <Select
                {...field}
                data={courseList} // course options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
                onChange={(e) => {
                  if (e) {
                    console.log(e);
                    field.onChange(e);
                    handleCourseChange(e);
                  }
                }}
              />
            )}
          />
          {errors.courseId && (
            <p className="error">{errors.courseId.message}</p>
          )}
        </div>

        <div className="flex-col">
          <label> Select a course topic </label>
          <Controller
            control={control}
            name="courseTopicId"
            render={({ field }) => (
              <Select
                {...field}
                key={JSON.stringify(courseTopicOptions)}
                data={courseTopicOptions} // course topic options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.courseTopicId && (
            <p className="error">{errors.courseTopicId.message}</p>
          )}
        </div>

        <button
          className={styles.formButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Create"}
        </button>

        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}
      </form>
    </div>
  );
};

export default ResourceTypes;
