"use server";

import { getUserById } from "@/database/data/user";
import { fetchFileByName } from "../fetching/files/fetchFileByName";
import dbConnect from "@/database/dbConnector";
import { CommentSchema } from "@/schemas";
import z from "zod";
import { FetchedFileData } from "@/utils/types_v2";

type UploadFileCommentProps = {
  values: z.infer<typeof CommentSchema>;
  userId: string;
  fileName: string;
};

/**
 * Server action to upload a file comment to the database.
 *
 * @param {UploadFileCommentProps} props - The properties of the comment.
 * @returns {Promise<{ failure?: string, success?: boolean }>} - The result of the operation.
 */
export const uploadFileComment = async ({
  values,
  userId,
  fileName,
}: UploadFileCommentProps): Promise<{
  failure?: string;
  success?: boolean;
}> => {
  try {
    const existingUser = await getUserById(userId);
    const file: FetchedFileData = await fetchFileByName({ name: fileName })

    if (!existingUser) {
      return { failure: "User not found" };
    }
    else if (file.failure) {
      return { failure: "File not found" }
    }

    const validatedFields = CommentSchema.safeParse(values);

    if (!validatedFields.success) {
      return { failure: "Invalid comment!" };
    }

    // Extract the comment text
    const { commentText } = validatedFields.data;

    const uploadDate = new Date();

    const uploadQuery = `
      INSERT INTO FileComments_v3 (fileId, userId, commentText, uploadDate) VALUES (?, ?, ?, ?)`;

    const { results, error } = await dbConnect(uploadQuery, [
      file.success?.id,
      userId,
      commentText,
      uploadDate,
    ]);

    if (error) {
      console.error("An error occurred while fetching data:", error);
      return {
        failure: "Internal server error, error uploading comment to db",
      };
    }

    if (results[0].insertId) {
      return { success: true };
    }
  } catch (error) {
    return {
      failure: "Internal server error, error uploading comment",
    };
  }

  return { failure: "Internal server error, error uploading comment" };
};
