"use server"
import { getCourseByName } from "@/database/data/courses"
import dbConnect from "@/database/dbConnector"
import { lowercaseAndReplaceSpace } from "@/utils/formatting"

export const fetchCoursesModules = async(courseName: string) => {
  try {
    const course = await getCourseByName(courseName)
    console.log(course?.CourseId)

    if (!course?.CourseId) {
      return { failure: "failed to get course Id"}
    }


    const query = `
      SELECT * FROM Modules WHERE CourseId = ?`
  
    const { results } = await dbConnect(query, [course?.CourseId]);
    console.log(results[0])

    if (results[0].length > 0) {
      const firstObject = results[0][0];
      const formattedModuleData = lowercaseAndReplaceSpace(results[0], Object.keys(firstObject)[1], Object.keys(firstObject)[0])
      console.log("fetchCourseModules results: ", formattedModuleData)
      return { success: formattedModuleData }
    }

    return { failure: "failed"}

  } catch (error) {
    console.error(error);
    return { failure: "Internal server error, error retrieving modules from db" }
  }

}