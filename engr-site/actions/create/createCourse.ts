"use server"

import { getCourseByName } from "@/database/data/courses"
import dbConnect from "@/database/dbConnector"
import { CreateCourseSchema } from "@/schemas"
import { getCurrentUser } from "@/utils/authHelpers"
import { capitalizeWords } from "@/utils/formatting"
import z from "zod"

/**
 * Creates a new course in the database.
 *
 * @param {z.infer<typeof CreateCourseSchema>} values - The values for the new course
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createCourse = async (values: z.infer<typeof CreateCourseSchema>) => {
  const user = await getCurrentUser()

  if (user?.role && user.role !== "admin") {
    return { error: "Not authenticated" }
  }

  // Attempt to parse and validate the input data against the CreateCourseSchema
  const validatedFields = CreateCourseSchema.safeParse(values);

  // The data is not valid, return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { courseName } = validatedFields.data;

  // Check if the course name already exists in the database
  const existingCourse = await getCourseByName(courseName);

  // The course name is already in use, return an error
  if (existingCourse) {
    console.log(existingCourse)
    return { error: "Course name already in use" };
  }



  const insertQuery = `INSERT INTO Courses_v2 (courseName) VALUES (?)`;
  const formattedCourseName = capitalizeWords(courseName);
  const { results }  = await dbConnect(insertQuery, [formattedCourseName]);

  // The course was created successfully, return success message
  return { success: "New course created" }
  
};


export default createCourse;