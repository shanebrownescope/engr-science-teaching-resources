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

    if (!user || user.role !== "admin") {
      return { error: "Not authenticated" }; 
    }

    // Normalize and validate `courseId` before any DB calls
    const id = parseInt(String(courseId).trim(), 10);
    if (Number.isNaN(id) || id <= 0) {
      return { error: "Invalid courseId" };
    }

    // Check if course exists
    const checkCourseQuery = `SELECT * FROM Courses_v3 WHERE id = ?`;
    const { results: existingCourseResults, error: checkError } = await dbConnect(checkCourseQuery, [id]);

    if (checkError) {
      return { error: "Failed to check existing course" };
    }

    if (!existingCourseResults || existingCourseResults.length === 0) {
      return { error: "Course not found" };
    }

    // Check for related data before deletion
    // Check for course topics
    const checkTopicsQuery = `SELECT COUNT(*) as count FROM CourseTopics_v3 WHERE courseId = ?`;
    const { results: topicsResults, error: topicsError } = await dbConnect(checkTopicsQuery, [id]);
    
    if (topicsError) {
      return { error: "Failed to check course topics" };
    }
    
    if (topicsResults && topicsResults[0]?.count > 0) {
      return { error: "Cannot delete course with existing course topics. Please delete all course topics first." };
    }

    // Check for external requests
    const checkRequestsQuery = `SELECT COUNT(*) as count FROM ExternalRequests_v3 WHERE courseId = ?`;
    const { results: requestsResults, error: requestsError } = await dbConnect(checkRequestsQuery, [id]);
    
    if (requestsError) {
      return { error: "Failed to check external requests" };
    }
    
    if (requestsResults && requestsResults[0]?.count > 0) {
      return { error: "Cannot delete course with existing external requests. Please handle all external requests first." };
    }

    // Delete the course
    const deleteQuery = `DELETE FROM Courses_v3 WHERE id = ?`;
    const { results, error } = await dbConnect(deleteQuery, [id]);

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