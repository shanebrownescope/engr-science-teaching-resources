"use client";

import { CreateConceptSchema } from "@/schemas";
import { Select } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormSelectProps } from "@/utils/types";
import createConcept from "@/actions/create/createConcept";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import styles from "@/styles/form.module.css";
import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";
import { fetchResourceTypesByCourseTopicId } from "@/actions/fetching/resourceType/fetchResourceTypesByCourseTopicId";
import { FormattedData } from "@/utils/formatting";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type FormFields = z.infer<typeof CreateConceptSchema>;

const Concepts = () => {
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
  const [resourceTypeOptions, setResourceTypeOptions] = useState<
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
      conceptName: "",
      courseId: "",
      courseTopicId: "",
      resourceTypeId: "",
    },
    resolver: zodResolver(CreateConceptSchema), // Resolver for Zod schema validation
  });

  const watchedValue = watch("conceptName"); //
  console.log(watchedValue);

  const watchedValue2 = watch("courseId"); //
  console.log(watchedValue2);
  const watchedValue3 = watch("courseTopicId"); //
  console.log(watchedValue3);

  const watchedValue4 = watch("resourceTypeId"); //
  console.log(watchedValue4);

  /**
   * Handles changes to the course select input. When a new course is selected,
   * this function retrieves the modules for that course and sets them as options
   * in the module select input. Additionally, the section select input is cleared.
   *
   * @param {string} selectedCourseId The ID of the selected course.
   */
  const handleCourseChange = async (selectedCourseId: string) => {
    setResourceTypeOptions([]); // Clear sectionOptions
    setValue("courseTopicId", ""); // Clear courseTopicId value
    setValue("resourceTypeId", ""); // Clear resourceTypeId value

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

  const handleCourseTopicChange = async (selectedCourseTopicId: string) => {
    setValue("resourceTypeId", ""); // Clear sectionId value

    const results = await fetchResourceTypesByCourseTopicId(
      selectedCourseTopicId,
    );
    if (results?.success) {
      const formattedResourceTypeList = results.success.map(
        (section: FormattedData) => ({
          value: section.id.toString(),
          label: section.name,
        }),
      );
      setResourceTypeOptions(formattedResourceTypeList);
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
      const results = await createConcept(data);
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
      <p className={styles.formAdminTitle}> Create Concept </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col ">
          <label> Concept Name</label>
          <Controller
            control={control}
            name="conceptName"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter section name"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.conceptName && (
            <p className="error">{errors.conceptName.message}</p>
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

        <div className="flex-co gap-p25">
          <label> Select course topic</label>
          <Controller
            control={control}
            name="courseTopicId"
            render={({ field }) => (
              <Select
                {...field}
                key={JSON.stringify(courseTopicOptions)} // Add key prop to force re-render
                data={courseTopicOptions} // module options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
                onChange={(e) => {
                  if (e) {
                    console.log(e);
                    field.onChange(e);
                    handleCourseTopicChange(e);
                  }
                }}
              />
            )}
          />
          {errors.courseTopicId && (
            <p className="error">{errors.courseTopicId.message}</p>
          )}
        </div>

        <div className="flex-co gap-p25">
          <label> Select resource type</label>
          <Controller
            control={control}
            name="resourceTypeId"
            render={({ field }) => (
              <Select
                {...field}
                key={JSON.stringify(resourceTypeOptions)} // Add key prop to force re-render
                data={resourceTypeOptions} // section options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.resourceTypeId && (
            <p className="error">{errors.resourceTypeId.message}</p>
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

export default Concepts;
