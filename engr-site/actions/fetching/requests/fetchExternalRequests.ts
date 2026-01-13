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
    console.log("fetchExternalRequests: Starting...");
    
    const user = await getCurrentUser();
    console.log("fetchExternalRequests: Current user:", user);

    if (user?.role !== "admin") {
      console.log("fetchExternalRequests: Unauthorized access - user role:", user?.role);
      return { failure: "Unauthorized access" };
    }

    const query = `
      SELECT er.id, er.name, er.email, er.courseId, c.courseName, er.description, 
             er.status, er.createdAt
      FROM ExternalRequests_v3 er
      LEFT JOIN Courses_v3 c ON er.courseId = c.id
      ORDER BY er.createdAt DESC
    `;

    console.log("fetchExternalRequests: Executing query...");
    const { results, error } = await dbConnect(query, []);

    if (error) {
      console.error("fetchExternalRequests: Database error:", error);
      return { failure: "Error fetching external requests" };
    }

    console.log("fetchExternalRequests: Query successful. Found", results[0]?.length || 0, "records");
    
    return { success: results[0] };
  } catch (error) {
    console.error("fetchExternalRequests: Failed to fetch external requests:", error);
    return { failure: "Error fetching external requests" };
  }
};