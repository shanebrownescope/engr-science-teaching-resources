"use server";

import { getUserById } from "@/database/data/user";
import { fetchLinkByName } from "../fetching/links/fetchLinkByName";
import dbConnect from "@/database/dbConnector";
import { ReviewSchema } from "@/schemas";
import z from "zod";
import { FetchedLinkData } from "@/utils/types_v2";

type UploadLinkReviewProps = {
  values: z.infer<typeof ReviewSchema>;
  userId: string | undefined;
  linkName: string;
};

/**
 * Server action to upload a link review to the database.
 *
 * @param {UploadLinkReviewProps} props - The properties of the review.
 * @returns {Promise<{ failure?: string, success?: boolean }>} - The result of the operation.
 */
export const uploadLinkReview = async ({
  values,
  userId,
  linkName,
}: UploadLinkReviewProps): Promise<{
  failure?: string;
  success?: boolean;
}> => {
  try {
    let existingUser
    if (userId) { existingUser = await getUserById(userId); }
    const link: FetchedLinkData = await fetchLinkByName({ name: linkName })

    if (!existingUser) {
      return { failure: "User not found" };
    }
    else if (link.failure) {
      return { failure: "Link not found" }
    }

    const validatedFields = ReviewSchema.safeParse(values);

    if (!validatedFields.success) {
      return { failure: "Invalid review!" };
    }

    // Extract the review data
    const { title, userPublicName, rating, comments } = validatedFields.data;

    const uploadDate = new Date();

    const uploadQuery = `
      INSERT INTO LinkReviews_v3 (linkId, userId, rating, comments, uploadDate, title, userPublicName) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const { results, error } = await dbConnect(uploadQuery, [
      link.success?.id,
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
