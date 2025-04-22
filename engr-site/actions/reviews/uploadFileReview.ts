"use server";

import { getUserById } from "@/database/data/user";
import { fetchFileByName } from "../fetching/files/fetchFileByName";
import dbConnect from "@/database/dbConnector";
import { ReviewSchema } from "@/schemas";
import z from "zod";
import { FetchedFileData } from "@/utils/types_v2";

type UploadFileReviewProps = {
  values: z.infer<typeof ReviewSchema>;
  userId: string;
  fileName: string;
};

/**
 * Server action to upload a file review to the database.
 *
 * @param {UploadFileReviewProps} props - The properties of the review.
 * @returns {Promise<{ failure?: string, success?: boolean }>} - The result of the operation.
 */
export const uploadFileReview = async ({
  values,
  userId,
  fileName,
}: UploadFileReviewProps): Promise<{
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

    const validatedFields = ReviewSchema.safeParse(values);

    if (!validatedFields.success) {
      return { failure: "Invalid review!" };
    }

    // Extract the review data
    const { title, userPublicName, rating, comments } = validatedFields.data;

    const uploadDate = new Date();

    const uploadQuery = `
      INSERT INTO FileReviews_v3 (fileId, userId, rating, comments, uploadDate, title, userPublicName) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const { results, error } = await dbConnect(uploadQuery, [
      file.success?.id,
      userId,
      rating,
      comments,
      uploadDate,
      title,
      userPublicName
    ]);

    if (error) {
      console.error("An error occurred while inserting review data:", error);
      return {
        failure: "Internal server error, error uploading review to db",
      };
    }

    if (results[0].insertId) {
      return { success: true };
    }
  } catch (error) {
    return {
      failure: "Internal server error, error uploading review",
    };
  }

  return { failure: "Internal server error, error uploading review" };
};
