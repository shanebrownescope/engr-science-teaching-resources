"use server";

import dbConnect from "@/database/dbConnector";
import { fetchLinkByName } from "@/actions/fetching/links/fetchLinkByName";
import { FetchedLinkData } from "@/utils/types_v2";

type UpdateLinkAvgRatingProps = {
  linkName: string;
  newRating: number;
};

/**
 * Asynchronously updates the average rating of a link in the database
 * @param {UpdateLinkAvgRatingProps} props - An object containing the link name and new rating
 * @returns {Promise<{ failure?: string, success?: boolean }>} An object containing the result of the update operation
 */
export const updateLinkAvgRating = async ({
  linkName,
  newRating,
}: UpdateLinkAvgRatingProps): Promise<{
  failure?: string;
  success?: boolean;
}> => {
  try {
    // Round the input rating to 2 decimal places immediately
    const roundedNewRating = Math.round(newRating * 100) / 100;

    // First, fetch the current link data
    const linkData: FetchedLinkData = await fetchLinkByName({ name: linkName });

    if (linkData.failure) {
      return { failure: "Link not found" };
    }

    const link = linkData.success;
    const currentAvgRating = link?.avgRating || 0;
    const currentReviewCount = link?.numReviews || 0;

    // Calculate the new average rating
    const newTotalRating = currentAvgRating * currentReviewCount + roundedNewRating;
    const newReviewCount = currentReviewCount + 1;
    const updatedAvgRating = Math.round((newTotalRating / newReviewCount) * 100) / 100;

    // Update the link's average rating in the database
    const updateQuery = `
      UPDATE Links_v3
      SET avgRating = ?, numReviews = ?
      WHERE id = ?
    `;

    const { results: updateResult, error } = await dbConnect(updateQuery, [
      updatedAvgRating,
      newReviewCount,
      link?.id,
    ]);

    if (error) {
      console.error("Error updating link rating:", error);
      return { failure: "Internal server error" };
    }

    if (updateResult.affectedRows === 0) {
      return { failure: "Link not found or not updated" };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error in updateLinkRating:", error);
    return {
      failure: "Internal server error",
    };
  }
};