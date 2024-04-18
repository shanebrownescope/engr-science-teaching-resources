"use client";

import {
  CreateSectionSchema,
} from "@/schemas";
import { Group, Box, Select } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

import { fetchCourses } from "@/actions/fetching/fetchCourses";
import { FormSelectProps } from "@/utils/types";
import { fetchModulesByCourseId } from "@/actions/fetching/fetchModulesByCourseId";
import createSection from "@/actions/create/createSection";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import styles from "@/styles/form.module.css";

type FormFields = z.infer<typeof CreateSectionSchema>;

const Sections = () => {
  const router = useRouter()
  const role = useCurrentRole()
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
  const [courseList, setCourseList] = useState<FormSelectProps[]>([]);
  const [success, setSuccess] = useState<string | undefined>("");
  const [moduleOptions, setModuleOptions] = useState<FormSelectProps[]>([]);
  console.log(courseList);

  useEffect(() => {
    const fetchAllCourses = async () => {
      const coursesOptionsData = await fetchCourses();
      console.log(coursesOptionsData.success);
      if (coursesOptionsData.success) {
        const formattedCourseList = coursesOptionsData.success.map(
          (course: any) => ({
            value: course.id.toString(),
            label: course.original,
          })
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
      sectionName: "",
      courseId: "",
      moduleId: "",
    },
    resolver: zodResolver(CreateSectionSchema), // Resolver for Zod schema validation
  });

  const watchedValue = watch("sectionName"); //
  console.log(watchedValue);

  const watchedValue2 = watch("courseId"); //
  console.log(watchedValue2);
  const watchedValue3 = watch("moduleId"); //
  console.log(watchedValue3);

  const handleCourseChange = async (selectedCourseId: string) => {
    setValue("moduleId", ""); // Clear moduleId value

    const results = await fetchModulesByCourseId(selectedCourseId);
    if (results?.success) {
      const formattedModuleList = results.success.map((module: any) => ({
        value: module.id.toString(),
        label: module.original,
      }));
      setModuleOptions(formattedModuleList);
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
      const results = await createSection(data)
      console.log(results)
      if (results.error) {
        console.log("here")
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
      <p className={styles.formAdminTitle}> Create Section </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Section Name</label>
          <Controller
            control={control}
            name="sectionName"
            render={({ field }) => (
              <input
                className={errors.sectionName && "input-error"}
                {...field}
                type="text"
                placeholder="Enter section name"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.sectionName && (
            <p className="error">{errors.sectionName.message}</p>
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
          {errors.courseId && <p className="error">{errors.courseId.message}</p>}
        </div>

        <div className="flex-col">
          <label> Enter Module</label>
          <Controller
            control={control}
            name="moduleId"
            render={({ field }) => (
              <Select
                {...field}
                key={JSON.stringify(moduleOptions)}
                data={moduleOptions} // module options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.moduleId && <p className="error">{errors.moduleId.message}</p>}
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

export default Sections;
