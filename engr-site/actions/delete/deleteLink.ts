"use server";

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";
import { revalidatePath } from "next/cache";

/**
 * Deletes a link from the database.
 *
 * @param {string | number} linkId - The ID of the link to delete
 * @returns {{ error?: string, success?: string }} - The response from the deletion process
 */
export const deleteLinkAction = async (linkId: string | number) => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { error: "Not authenticated" };
        }

        const id = parseInt(String(linkId).trim(), 10);
        if (Number.isNaN(id) || id <= 0) {
            return { error: "Invalid linkId" };
        }

        // Check if link exists and get uploadedUserId
        const checkLinkQuery = `SELECT * FROM Links_v3 WHERE id = ?`;
        const { results: existingLinkResults, error: checkError } = await dbConnect(checkLinkQuery, [id]);

        if (checkError || !existingLinkResults || existingLinkResults[0].length === 0) {
            return { error: "Link not found" };
        }

        const link = existingLinkResults[0][0];

        // Check permissions
        if (user.role !== "admin" && !(user.role === "instructor" && user.id === String(link.uploadedUserId))) {
            return { error: "Not authorized to delete this link" };
        }

        // Delete the link from the database
        const deleteQuery = `DELETE FROM Links_v3 WHERE id = ?`;
        const { error } = await dbConnect(deleteQuery, [id]);

        if (error) {
            return { error: "Failed to delete link from database" };
        }

        revalidatePath("/"); // revalidate all paths to reflect the deleted link
        return { success: "Link deleted successfully" };
    } catch (error) {
        console.error("Error deleting link:", error);
        return { error: "Failed to delete link" };
    }
};
