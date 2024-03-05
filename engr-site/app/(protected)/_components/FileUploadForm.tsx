"use server"
import { getAllCourses } from "@/database/data/courses"
import { FileUpload } from "./FileUpload"
import { fetchCourses } from "@/actions/fetching/fetchCourses"


export const FileUploadForm = async () => {
  const coursesOptionsData = await fetchCourses()
  console.log(coursesOptionsData.success)

  return (
    <div>
      <FileUpload coursesOptionsData={coursesOptionsData.success} />
    </div>
  )
}
