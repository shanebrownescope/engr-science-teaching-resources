"use client";

import { CreateModuleSchema } from "@/schemas";
import { Group, Box, Select } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

import { fetchCourses } from "@/actions/fetching/fetchCourses";
import { FormSelectProps } from "@/utils/types";
import createModule from "@/actions/create/createModule";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import styles from "@/styles/form.module.css";

type FormFields = z.infer<typeof CreateModuleSchema>;

const Modules = () => {
  const router = useRouter();
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
  const [courseList, setCourseList] = useState<FormSelectProps[]>([]);
  const [success, setSuccess] = useState<string | undefined>("");

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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      moduleName: "",
      courseId: "",
    },
    resolver: zodResolver(CreateModuleSchema), // Resolver for Zod schema validation
  });

  const watchedValue = watch("moduleName"); //
  console.log(watchedValue);

  const watchedValue2 = watch("courseId"); //
  console.log(watchedValue2);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      // await new Promise((resolve) => setTimeout(resolve, 4000))
      console.log(data);
      const results = await createModule(data);
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
    <div className={styles.formAdminWrapper}>
      <p className={styles.formAdminTitle}> Create Module </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Module Name</label>
          <Controller
            control={control}
            name="moduleName"
            render={({ field }) => (
              <input
                className={errors.moduleName && "input-error"}
                {...field}
                type="text"
                placeholder="Enter module name"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.moduleName && (
            <p className="error">{errors.moduleName.message}</p>
          )}
        </div>

        <div className="flex-col">
          <label> Enter Course for module</label>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <Select
                {...field}
                data={courseList} // Example options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.courseId && <p className="error">{errors.courseId.message}</p>}
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

export default Modules;
