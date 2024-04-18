"use client";

import {
  CreateConceptSchema
} from "@/schemas";
import { Group, Box, Select } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

import { FormattedData } from "@/utils/formatting";
import { fetchCourses } from "@/actions/fetching/fetchCourses";
import { SelectDropdown } from "@/components/mantine/SelectDropdown";
import { FormSelectProps } from "@/utils/types";
import createModule from "@/actions/create/createModule";
import { fetchModulesByCourse } from "@/actions/fetching/fetchModulesByCourse";
import { fetchModulesByCourseId } from "@/actions/fetching/fetchModulesByCourseId";
import createSection from "@/actions/create/createSection";
import { fetchSectionsByModule } from "@/actions/fetching/fetchSectionsByModule";
import createConcept from "@/actions/create/createConcept";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import  styles from "@/styles/form.module.css";

type FormFields = z.infer<typeof CreateConceptSchema>;

const Concepts = () => {
  const router = useRouter()
  const role = useCurrentRole()
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
  
  const [courseList, setCourseList] = useState<FormSelectProps[]>([]);
  const [success, setSuccess] = useState<string | undefined>("");
  const [moduleOptions, setModuleOptions] = useState<FormSelectProps[]>([]);
  const [sectionOptions, setSectionOptions] = useState<FormSelectProps[]>([]);
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
      conceptName: "",
      courseId: "",
      moduleId: "",
      sectionId: "",
    },
    resolver: zodResolver(CreateConceptSchema), // Resolver for Zod schema validation
  });

  const watchedValue = watch("conceptName"); //
  console.log(watchedValue);

  const watchedValue2 = watch("courseId"); //
  console.log(watchedValue2);
  const watchedValue3 = watch("moduleId"); //
  console.log(watchedValue3);

  const watchedValue4 = watch("sectionId"); //
  console.log(watchedValue4);

  /**
   * Handles changes to the course select input. When a new course is selected,
   * this function retrieves the modules for that course and sets them as options
   * in the module select input. Additionally, the section select input is cleared.
   *
   * @param {string} selectedCourseId The ID of the selected course.
   */
  const handleCourseChange = async (selectedCourseId: string) => {
    setSectionOptions([]); // Clear sectionOptions
    setValue('sectionId', ''); // Clear sectionId value
    setValue('moduleId', ''); // Clear moduleId value

    const results = await fetchModulesByCourseId(selectedCourseId);
    if (results?.success) {
      const formattedModuleList = results.success.map((module: any) => ({
        value: module.id.toString(),
        label: module.original,
      }));
      setModuleOptions(formattedModuleList);
    }
  };


  const handleModuleChange = async (selectedModuleId: string) => {
    setValue('sectionId', ''); // Clear sectionId value
    
    const results = await fetchSectionsByModule({id: selectedModuleId});
    if (results?.success) {
      const formattedSectionList = results.success.map((section: any) => ({
        value: section.id.toString(),
        label: section.original,
      }));
      setSectionOptions(formattedSectionList);
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
      const results = await createConcept(data)
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
      <p className={styles.formAdminTitle}> Create Concept </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col ">
          <label> Section Name</label>
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
          {errors.courseId && <p className="error">{errors.courseId.message}</p>}
        </div>

        <div className="flex-co gap-p25">
          <label> Enter Module</label>
          <Controller
            control={control}
            name="moduleId"
            render={({ field }) => (
              <Select
                {...field}
                key={JSON.stringify(moduleOptions)} // Add key prop to force re-render
                data={moduleOptions} // module options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
                onChange={(e) => {
                  if (e) {
                    console.log(e);
                    field.onChange(e);
                    handleModuleChange(e);
                  }
                }}
              />
            )}
          />
          {errors.moduleId && <p className="error">{errors.moduleId.message}</p>}
        </div>


        <div className="flex-co gap-p25">
          <label> Enter Section</label>
          <Controller
            control={control}
            name="sectionId"
            render={({ field }) => (
              <Select
                {...field}
                key={JSON.stringify(sectionOptions)} // Add key prop to force re-render
                data={sectionOptions} // section options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.sectionId && <p className="error">{errors.sectionId.message}</p>}
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
