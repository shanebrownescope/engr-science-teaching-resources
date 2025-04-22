"use server";

import dbConnect from "@/database/dbConnector";
import { fetchFileByName } from "@/actions/fetching/files/fetchFileByName";
import { FetchedFileData } from "@/utils/types_v2";

type UpdateFileAvgRatingProps = {
  fileName: string;
  newRating: number;
};

/**
 * Asynchronously updates the average rating of a file in the database
 * @param {UpdateFileAvgRatingProps} props - An object containing the file name and new rating
 * @returns {Promise<{ failure?: string, success?: boolean }>} An object containing the result of the update operation
 */
export const updateFileAvgRating = async ({
  fileName,
  newRating,
}: UpdateFileAvgRatingProps): Promise<{
  failure?: string;
  success?: boolean;
}> => {
  try {
    // First, fetch the current file data
    const fileData: FetchedFileData = await fetchFileByName({ name: fileName });

    if (fileData.failure) {
      return { failure: "File not found" };
    }

    const file = fileData.success;
    const currentAvgRating = file?.avgRating || 0;
    const currentReviewCount = file?.numReviews || 0;

    // Calculate the new average rating
    const newTotalRating = currentAvgRating * currentReviewCount + newRating;
    const newReviewCount = currentReviewCount + 1;
    const updatedAvgRating = newTotalRating / newReviewCount;

    // Update the file's average rating in the database
    const updateQuery = `
      UPDATE Files_v3
      SET avgRating = ?, numReviews = ?
      WHERE id = ?
    `;

    const { results: updateResult, error } = await dbConnect(updateQuery, [
      updatedAvgRating,
      newReviewCount,
      file?.id,
    ]);

    if (error) {
      console.error("Error updating file rating:", error);
      return { failure: "Internal server error" };
    }

    if (updateResult.affectedRows === 0) {
      return { failure: "File not found or not updated" };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error in updateFileRating:", error);
    return {
      failure: "Internal server error",
    };
  }
};