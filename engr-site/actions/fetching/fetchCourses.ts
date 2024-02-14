"use server"
import dbConnect from "@/database/dbConnector"
import { lowercaseAndReplaceSpace } from "@/utils/formatting"

export const fetchCourses = async() => {
  try {
    const query = `SELECT * FROM Courses` 
  
    const { results, error } = await dbConnect(query);
  
    if (results[0].length > 0) {
      const firstObject = results[0][0];
      const field = Object.keys(firstObject)[1]
      console.log(field)
      const formattedCourseData = lowercaseAndReplaceSpace(results[0], Object.keys(firstObject)[1], Object.keys(firstObject)[0])
      console.log(formattedCourseData)
      console.log("fetchCourses results: ", formattedCourseData)
      return { success: formattedCourseData }
    }
    
  } catch (error) {
    console.error(error);
    return { failure: "Internal server error, error retrieving courses from db" }
  }

}