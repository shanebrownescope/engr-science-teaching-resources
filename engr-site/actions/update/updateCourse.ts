"use server";

import { getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { CreateCourseSchema } from "@/schemas";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeWords } from "@/utils/formatting";

/**
 * Updates an existing course in the database.
 *
 * @param {object} params - The parameters for updating the course
 * @param {string} params.id - The ID of the course to update
 * @param {string} params.courseName - The new name for the course
 * @param {string} [params.description] - The new description for the course (optional)
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const updateCourse = async ({ 
  id, 
  courseName, 
  description 
}: { 
  id: string, 
  courseName: string, 
  description?: string 
}) => {
  try {
    const user = await getCurrentUser();

    if (user?.role && user.role !== "admin") {
      return { error: "Not authenticated" };
    }

    // Validate the new course name using the existing schema
    const validatedFields = CreateCourseSchema.safeParse({ courseName });

    if (!validatedFields.success) {
      return { error: "Invalid course name!" };
    }

    // Check if course with this ID exists
    const checkCourseQuery = `SELECT * FROM Courses_v2 WHERE id = ?`;
    const { results: existingCourseResults, error: checkError } = await dbConnect(checkCourseQuery, [id]);

    if (checkError) {
      return { error: "Failed to check existing course" };
    }

    if (!existingCourseResults || existingCourseResults.length === 0) {
      return { error: "Course not found" };
    }

    // Check if another course with the same name already exists (excluding current course)
    const existingCourseWithName = await getCourseByName(courseName);
    
    if (existingCourseWithName && existingCourseWithName.id.toString() !== id) {
      return { error: "Course name already in use" };
    }

    // Build the update query dynamically based on what fields are provided
    const formattedCourseName = capitalizeWords(courseName);
    let updateQuery = `UPDATE Courses_v2 SET courseName = ?`;
    let queryParams = [formattedCourseName];

    // Add description to the query if provided
    if (description !== undefined) {
      updateQuery += `, description = ?`;
      queryParams.push(description);
    }

    updateQuery += ` WHERE id = ?`;
    queryParams.push(id); // Use id as string

    // Update the course
    const { results, error } = await dbConnect(updateQuery, queryParams);

    if (error) {
      return { error: "Failed to update course" };
    }

    return { success: "Course updated successfully" };
  } catch (error) {
    console.error("Error updating course:", error);
    return { error: "Failed to update course" };
  }
};

export default updateCourse;