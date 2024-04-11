"use client";

import {
  UploadFileSchema
} from "@/schemas";
import { Group, Box, Select } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent } from "react";
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
import { fetchConceptsBySectionId } from "@/actions/fetching/fetchConceptsBySectionId";

type FormFields = z.infer<typeof UploadFileSchema>;

const FileUploadZod = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [courseOptions, setCourseOptions] = useState<FormSelectProps[]>([]);
  const [success, setSuccess] = useState<string | undefined>("");
  const [moduleOptions, setModuleOptions] = useState<FormSelectProps[]>([]);
  const [sectionOptions, setSectionOptions] = useState<FormSelectProps[]>([]);
  const [conceptOptions, setConceptOptions] = useState<FormSelectProps[]>([]);
  console.log(courseOptions);

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
        setCourseOptions(formattedCourseList);
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
    resolver: zodResolver(UploadFileSchema), // Resolver for Zod schema validation
  });


  const watchedCourseId = watch("courseId");
  console.log("--watched courseId: ",watchedCourseId);

  const watchedCourseName= watch("courseName"); 
  console.log("--watched courseName: ",watchedCourseName);


  const watchedModuleId = watch("moduleId"); 
  console.log("--watched moduleId: ",watchedModuleId);

  const watchedModuleName = watch("moduleName"); 
  console.log("--watched moduleName: ",watchedModuleName);

  const watchedSectionId = watch("sectionId"); 
  console.log("--watched sectionId: ",watchedSectionId);
  const watchedSectionName = watch("sectionName");
  console.log("--watched sectionName: ",watchedSectionName);


  const watchedConceptId = watch("conceptId");
  console.log("--watched conceptId: ",watchedConceptId);

  const watchedConceptName = watch("conceptName"); 
  console.log("--watched conceptName: ",watchedConceptName);
  
  const watchedFileName = watch("fileName");
  console.log("--watched fileName: ",watchedFileName);

  const watchedFileUrl = watch("fileUrl");
  console.log("--watched file: ",watchedFileUrl);



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //* in browser, get url
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    console.log("==selectedFile: ", file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      console.log("==url: ", url);
      setFileUrl(url);
      setValue("fileUrl", url);
    } else {
      setFileUrl(undefined);
    }
  };


  /**
   * Handles changes to the course select input. When a new course is selected,
   * this function retrieves the modules for that course and sets them as options
   * in the module select input. Additionally, the section select input is cleared.
   *
   * @param {string} selectedCourseId The ID of the selected course.
   */
  const handleCourseChange = async (selectedCourseId: string) => {
    const selectedCourse = courseOptions.find(course => course.value === selectedCourseId);
    setValue('courseName', selectedCourse?.label as string);
    console.log(courseOptions)

    setSectionOptions([]); // Clear sectionOptions
    setConceptOptions([]); // Clear conceptOptions
    setValue('moduleId', ''); // Clear moduleId value
    setValue('moduleName', ''); // Clear moduleName value
    setValue('sectionId', ''); // Clear sectionId value
    setValue('sectionName', ''); // Clear sectionName value
    setValue('conceptId', ''); // Clear conceptId value
    setValue('conceptName', ''); // Clear conceptName value
    // const { value, label } = selectedCourseId.target.options[selectedCourseId.target.selectedIndex];
    // console.log(value, label)

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
    const selectedModule = moduleOptions.find(module => module.value === selectedModuleId);
    setValue('moduleName', selectedModule?.label as string);

    setSectionOptions([]); // Clear sectionOptions
    setConceptOptions([]); // Clear conceptOptions
    setValue('sectionId', ''); // Clear sectionId value
    setValue('sectionName', ''); // Clear sectionName value
    setValue('conceptId', ''); // Clear conceptId value
    setValue('conceptName', ''); // Clear conceptName value
    
    const results = await fetchSectionsByModule({id: selectedModuleId});
    if (results?.success) {
      const formattedSectionList = results.success.map((section: any) => ({
        value: section.id.toString(),
        label: section.original,
      }));
      setSectionOptions(formattedSectionList);
    }
  };

  const handleSectionChange = async (selectedSectionId: string) => {
    const selectedSection = sectionOptions.find(section => section.value === selectedSectionId);
    setValue('sectionName', selectedSection?.label as string);

    setConceptOptions([]); // Clear conceptOptions
    setValue('conceptId', ''); // Clear conceptId value
    setValue('conceptName', ''); // Clear conceptName value
    
    const results = await fetchConceptsBySectionId({id: selectedSectionId});
    if (results?.success) {
      const formattedConceptList = results.success.map((concept: any) => ({
        value: concept.id.toString(),
        label: concept.original,
      }));
      setConceptOptions(formattedConceptList);
    }
  }

  const handleConceptChange = async (selectedConceptId: string) => {
    const selectedConcept = conceptOptions.find(concept => concept.value === selectedConceptId);
    setValue('conceptName', selectedConcept?.label as string);
  }

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
    <Box maw={340} mx="auto">
      <form className="flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col gap-p25">
          <label> Enter File Name</label>
          <Controller
            control={control}
            name="fileName"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter file name"
                disabled={isSubmitting}
              />
            )}
          />
        </div>
        {errors.conceptName && (
          <p className="error">{errors.conceptName.message}</p>
        )}

        <div className="flex-col gap-p25">
          <label> Select File</label>
    
          <input type="file" accept="pdf" onChange={handleFileChange} />
  
        
          {fileUrl && file && 
            <div>
              <iframe src={fileUrl} />
            </div>}
        </div>
        {errors.conceptName && (
          <p className="error">{errors.conceptName.message}</p>
        )}

        <div className="flex-co gap-p25">
          <label> Enter Course</label>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <Select
                {...field}
                data={courseOptions} // course options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
                onChange={(e) => {
                  console.log(e)
                  if (e) {
                    console.log(" here and is e: ",e);
                    field.onChange(e);

                    handleCourseChange(e);
                  }
                }}
              />
            )}
          />
        </div>
        {errors.courseId && <p className="error">{errors.courseId.message}</p>}

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
        </div>
        {errors.moduleId && <p className="error">{errors.moduleId.message}</p>}


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
                onChange={(e) => {
                  if (e) {
                    console.log(e);
                    field.onChange(e);
                    handleSectionChange(e);
                  }
                }}
              />
            )}
          />
        </div>
        {errors.sectionId && <p className="error">{errors.sectionId.message}</p>}

        <div className="flex-co gap-p25">
          <label> Enter Concept</label>
          <Controller
            control={control}
            name="conceptId"
            render={({ field }) => (
              <Select
                {...field}
                key={JSON.stringify(conceptOptions)} // Add key prop to force re-render
                data={conceptOptions} // section options for the SelectDropdown
                placeholder="Select an option"
                disabled={isSubmitting}
                onChange={(e) => {
                  if (e) {
                    console.log(e);
                    field.onChange(e);
                    handleConceptChange(e);
                  }
                }}
              />
            )}
          />
        </div>
        {errors.sectionId && <p className="error">{errors.sectionId.message}</p>}

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

export default FileUploadZod;
