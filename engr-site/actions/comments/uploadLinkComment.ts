"use server";

import { getUserById } from "@/database/data/user";
import dbConnect from "@/database/dbConnector";
import { CommentSchema } from "@/schemas";
import { FetchedLinkData } from "@/utils/types_v2";
import z from "zod";
import { fetchLinkByName } from "../fetching/links/fetchLinkByName";

type UploadLinkCommentProps = {
  values: z.infer<typeof CommentSchema>;
  userId: string;
  linkName: string;
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
  linkName,
}: UploadLinkCommentProps) => {
  try {
    const existingUser = await getUserById(userId);
    const link: FetchedLinkData = await fetchLinkByName({ name: linkName })

    if (!existingUser) {
      return { failure: "User not found" };
    }
    else if (link.failure) {
      return { failure: "Link not found" }
    }

    const validatedFields = CommentSchema.safeParse(values);

    if (!validatedFields.success) {
      return { failure: "Invalid comment!" };
    }

    const { commentText } = validatedFields.data;

    const uploadDate = new Date();

    const uploadQuery = `
      INSERT INTO LinkComments_v3 (linkId, userId, commentText, uploadDate) VALUES (?, ?, ?, ?)`;

    const { results, error } = await dbConnect(uploadQuery, [
      link.success?.id,
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
