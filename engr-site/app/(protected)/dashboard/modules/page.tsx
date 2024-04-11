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

type FormFields = z.infer<typeof CreateModuleSchema>;

const Modules = () => {
  const router = useRouter()
  const role = useCurrentRole()
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
    <Box maw={340} mx="auto">
      <form className="flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col gap-p25">
          <label> Module Name</label>
          <Controller
            control={control}
            name="moduleName"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter module name"
                disabled={isSubmitting}
              />
            )}
          />
        </div>
        {errors.moduleName && (
          <p className="error">{errors.moduleName.message}</p>
        )}

        <div className="flex-co gap-p25">
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
        </div>
        {errors.courseId && <p className="error">{errors.courseId.message}</p>}

        <Group justify="flex-end" mt="md">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Create"}
          </button>
        </Group>
        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}
      </form>
    </Box>
  );
};

export default Modules;
