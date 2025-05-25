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

    const updateQuery = `
      UPDATE ExternalRequests 
      SET status = 'approved', updatedAt = NOW() 
      WHERE id = ?
    `;

    await dbConnect(updateQuery, [id]);

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
      UPDATE ExternalRequests 
      SET status = 'rejected', updatedAt = NOW() 
      WHERE id = ?
    `;

    await dbConnect(updateQuery, [id]);

    // Logic for sending email notification to user can be added here

    return { success: "Request rejected" };
  } catch (error) {
    console.error("Failed to reject request:", error);
    return { error: "Error rejecting request" };
  }
};