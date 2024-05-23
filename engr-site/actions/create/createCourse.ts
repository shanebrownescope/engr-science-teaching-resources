"use server";

import { getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { CreateCourseSchema } from "@/schemas";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeWords } from "@/utils/formatting";
import z from "zod";

/**
 * Creates a new course in the database.
 *
 * @param {z.infer<typeof CreateCourseSchema>} values - The values for the new course
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createCourse = async (values: z.infer<typeof CreateCourseSchema>) => {
  try {
    const user = await getCurrentUser();

    if (user?.role && user.role !== "admin") {
      return { error: "Not authenticated" };
    }

    const validatedFields = CreateCourseSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { courseName } = validatedFields.data;

    const existingCourse = await getCourseByName(courseName);

    if (existingCourse) {
      console.log(existingCourse);
      return { error: "Course name already in use" };
    }

    const insertQuery = `INSERT INTO Courses_v2 (courseName) VALUES (?)`;
    const formattedCourseName = capitalizeWords(courseName);
    const { results, error } = await dbConnect(insertQuery, [
      formattedCourseName,
    ]);

    if (error) {
      return { error: "Failed to create course" };
    }

    return { success: "New course created" };
  } catch (error) {
    return { error: "Failed to create course" };
  }
};

export default createCourse;
