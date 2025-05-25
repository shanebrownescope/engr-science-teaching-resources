"use server";

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";

/**
 * Deletes a course from the database.
 *
 * @param {string} courseId - The ID of the course to delete
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const deleteCourse = async (courseId: string) => {
  try {
    const user = await getCurrentUser();

    if (user?.role && user.role !== "admin") {
      return { error: "Not authenticated" };
    }

    // Check if course exists
    const checkCourseQuery = `SELECT * FROM Courses_v2 WHERE id = ?`;
    const { results: existingCourseResults, error: checkError } = await dbConnect(checkCourseQuery, [parseInt(courseId)]);

    if (checkError) {
      return { error: "Failed to check existing course" };
    }

    if (!existingCourseResults || existingCourseResults.length === 0) {
      return { error: "Course not found" };
    }

    // WIP/Optional: Check for related data before deletion (not sure if needed yet)
    // We might want to prevent deletion if there are course topics or resources
    // Uncomment the following if you want to check for related data:

    /*
    // Check for course topics
    const checkTopicsQuery = `SELECT COUNT(*) as count FROM CourseTopics_v2 WHERE courseId = ?`;
    const { results: topicsResults, error: topicsError } = await dbConnect(checkTopicsQuery, [parseInt(courseId)]);
    
    if (topicsError) {
      return { error: "Failed to check course topics" };
    }
    
    if (topicsResults && topicsResults[0]?.count > 0) {
      return { error: "Cannot delete course with existing course topics. Please delete all course topics first." };
    }

    // Check for resources
    const checkResourcesQuery = `SELECT COUNT(*) as count FROM Resources WHERE courseId = ?`;
    const { results: resourcesResults, error: resourcesError } = await dbConnect(checkResourcesQuery, [parseInt(courseId)]);
    
    if (resourcesError) {
      return { error: "Failed to check course resources" };
    }
    
    if (resourcesResults && resourcesResults[0]?.count > 0) {
      return { error: "Cannot delete course with existing resources. Please delete all resources first." };
    }
    */

    // Delete the course
    const deleteQuery = `DELETE FROM Courses_v2 WHERE id = ?`;
    const { results, error } = await dbConnect(deleteQuery, [parseInt(courseId)]);

    if (error) {
      return { error: "Failed to delete course" };
    }

    return { success: "Course deleted successfully" };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { error: "Failed to delete course" };
  }
};

export default deleteCourse;