"use server";

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/utils/s3Client";
import { revalidatePath } from "next/cache";

/**
 * Deletes a file from the database and AWS S3.
 *
 * @param {string | number} fileId - The ID of the file to delete
 * @returns {{ error?: string, success?: string }} - The response from the deletion process
 */
export const deleteFileAction = async (fileId: string | number) => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { error: "Not authenticated" };
        }

        const id = parseInt(String(fileId).trim(), 10);
        if (Number.isNaN(id) || id <= 0) {
            return { error: "Invalid fileId" };
        }

        // Check if file exists and get uploadedUserId and s3Url
        const checkFileQuery = `SELECT * FROM Files_v3 WHERE id = ?`;
        const { results: existingFileResults, error: checkError } = await dbConnect(checkFileQuery, [id]);

        if (checkError || !existingFileResults || existingFileResults[0].length === 0) {
            return { error: "File not found" };
        }

        const file = existingFileResults[0][0];

        // Check permissions
        if (user.role !== "admin" && !(user.role === "instructor" && user.id === String(file.uploadedUserId))) {
            return { error: "Not authorized to delete this file" };
        }

        // Delete from S3 if s3Url exists
        if (file.s3Url) {
            try {
                const urlObj = new URL(file.s3Url);
                // Pathname typically starts with a slash
                const s3Key = decodeURIComponent(urlObj.pathname.substring(1));

                const deleteObjectCommand = new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: s3Key,
                });

                await s3.send(deleteObjectCommand);
            } catch (s3Error) {
                console.error("Error deleting from S3:", s3Error);
                // log the error but still proceed to delete from DB to stay consistent
            }
        }

        // Delete the file from the database
        const deleteQuery = `DELETE FROM Files_v3 WHERE id = ?`;
        const { error } = await dbConnect(deleteQuery, [id]);

        if (error) {
            return { error: "Failed to delete file from database" };
        }

        revalidatePath("/"); // revalidate all paths to refresh list
        return { success: "File deleted successfully" };
    } catch (error) {
        console.error("Error deleting file:", error);
        return { error: "Failed to delete file" };
    }
};
