"use server";

import { getUserById } from "@/database/data/user";
import dbConnect from "@/database/dbConnector";
import { CommentSchema } from "@/schemas";
import z from "zod";

type UploadLinkCommentProps = {
  values: z.infer<typeof CommentSchema>;
  userId: string;
  linkId: string;
};

/**
 * Server action to upload a link comment to the database.
 *
 * @param {UploadLinkCommentProps} props - The properties of the comment.
 * @returns {Promise<{ failure?: string, success?: boolean }>} - The result of the operation.
 */
export const uploadLinkComment = async ({
  values,
  userId,
  linkId,
}: UploadLinkCommentProps) => {
  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return { failure: "User not found" };
    }

    const validatedFields = CommentSchema.safeParse(values);
    if (!validatedFields.success) {
      return { failure: "Invalid comment!" };
    }

    const { commentText } = validatedFields.data;

    const uploadDate = new Date();
    console.log("uploadDate: ", uploadDate);

    const uploadQuery = `
      INSERT INTO LinkComments_v2 (linkId, userId, commentText, uploadDate) VALUES (?, ?, ?, ?)`;

    const { results, error } = await dbConnect(uploadQuery, [
      linkId,
      userId,
      commentText,
      uploadDate,
    ]);
    if (error) {
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
};
