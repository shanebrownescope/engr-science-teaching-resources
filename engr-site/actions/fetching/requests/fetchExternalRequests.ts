"use server";

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";

/**
 * Fetch all external requests
 * 
 * @returns Object containing external request data
 */
export const fetchExternalRequests = async () => {
  try {
    const user = await getCurrentUser();

    if (user?.role !== "admin") {
      return { failure: "Unauthorized access" };
    }

    const query = `
      SELECT er.id, er.name, er.email, er.courseId, c.courseName, er.description, 
             er.status, er.createdAt
      FROM ExternalRequests er
      LEFT JOIN Courses c ON er.courseId = c.id
      ORDER BY er.createdAt DESC
    `;

    const { results } = await dbConnect(query, []);

    return { success: results };
  } catch (error) {
    console.error("Failed to fetch external requests:", error);
    return { failure: "Error fetching external requests" };
  }
};