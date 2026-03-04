"use server";

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";

/**
 * Approve external request
 * 
 * @param id Request ID
 * @returns Operation result
 */
export const approveExternalRequest = async (id: number) => {
  try {
    const user = await getCurrentUser();

    if (user?.role !== "admin") {
      return { error: "Unauthorized operation" };
    }

    // Get request details
    const getRequestQuery = `SELECT email FROM ExternalRequests_v3 WHERE id = ?`;
    const { results: getResults, error: getError } = await dbConnect(getRequestQuery, [id]);

    if (getError || !getResults[0] || getResults[0].length === 0) {
      return { error: "Request not found" };
    }

    const userEmail = getResults[0][0].email;

    const updateQuery = `
      UPDATE ExternalRequests_v3 
      SET status = 'approved', updatedAt = NOW() 
      WHERE id = ?
    `;

    await dbConnect(updateQuery, [id]);

    // Update user role to instructor
    const updateUserQuery = `
      UPDATE Users_v3 
      SET role = 'instructor' 
      WHERE email = ? AND role != 'admin'
    `;

    await dbConnect(updateUserQuery, [userEmail]);

    // Logic for sending email notification to user can be added here

    return { success: "Request approved" };
  } catch (error) {
    console.error("Failed to approve request:", error);
    return { error: "Error approving request" };
  }
};

/**
 * Reject external request
 * 
 * @param id Request ID
 * @returns Operation result
 */
export const rejectExternalRequest = async (id: number) => {
  try {
    const user = await getCurrentUser();

    if (user?.role !== "admin") {
      return { error: "Unauthorized operation" };
    }

    const updateQuery = `
      UPDATE ExternalRequests_v3 
      SET status = 'rejected', updatedAt = NOW() 
      WHERE id = ?
    `;

    await dbConnect(updateQuery, [id]);

    // Fetch the email for the rejected request
    const getEmailQuery = `SELECT email FROM ExternalRequests_v3 WHERE id = ?`;
    const { results: requestResult } = await dbConnect(getEmailQuery, [id]);

    if (requestResult && requestResult[0] && requestResult[0].length > 0) {
      const requestEmail = requestResult[0][0].email;

      // Enforce the user's role as 'student'
      const roleUpdateQuery = `
        UPDATE Users_v3 
        SET role = 'student' 
        WHERE email = ?
      `;
      await dbConnect(roleUpdateQuery, [requestEmail]);
      console.log(`Successfully enforced student role for user ${requestEmail} upon rejection`);
    }

    // Logic for sending email notification to user can be added here

    return { success: "Request rejected" };
  } catch (error) {
    console.error("Failed to reject request:", error);
    return { error: "Error rejecting request" };
  }
};