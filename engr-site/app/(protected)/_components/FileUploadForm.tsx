"use server";
import { getAllCourses } from "@/database/data/courses";
import { FileUpload } from "./FileUpload";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormattedData } from "@/utils/formatting";
import { FileUploadUseForm } from "./FileUploadUseForm";

export const FileUploadForm = async () => {
  const courseList = await fetchCourses();
  const coursesOptionsData = courseList?.success?.map((course: FormattedData) => ({
    value: course.id.toString(),
    label: course.name,
  }))

  console.log(coursesOptionsData);

  return (
    <div>
      {/* <FileUpload coursesOptionsData={coursesOptionsData} /> */}
      <FileUploadUseForm coursesOptionsData={coursesOptionsData} />
    </div>
  );
};
