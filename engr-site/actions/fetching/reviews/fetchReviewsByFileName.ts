"use server";

import { fetchFileByName } from "@/actions/fetching/files/fetchFileByName";
import dbConnect from "@/database/dbConnector";
import { formatTimeAgo } from "@/utils/formatting";
import { ReviewsFileData, FetchedReviewsFileData } from "@/utils/types_v2";

/**
 * Fetches reviews for a file from the database by its name
 * @param {string} name - The name of the file
 * @returns {Promise<FetchedReviewsFileData | null>} - A promise that resolves to an object containing the fetched reviews or an error message
 */
export const fetchReviewsByFileName = async (
  name: string,
): Promise<FetchedReviewsFileData | null> => {
  try {
    const existingFile = await fetchFileByName({ name });
    if (existingFile.failure) {
      return { failure: "File not found" };
    }

    const selectQuery = `
      SELECT fr.id, fr.fileId, fr.userId, fr.rating, fr.comments, fr.uploadDate, fr.title, fr.userPublicName
      FROM FileReviews_v3 AS fr
      WHERE fr.fileId = ?
      ORDER BY fr.uploadDate DESC`
    ;

    const { results: reviews, error } = await dbConnect(selectQuery, [ existingFile.success?.id ]);

    if (error) {
      console.error("An error occurred while fetching reviews data:", error);
      return {
        failure:
          "Internal server error, error retrieving file reviews from db",
      };
    }

    // Return empty array if no reviews were found
    if (reviews[0].length === 0) {
      return {
        success: [],
      };
    }

    const reviewsTransformed = reviews[0].map((review: ReviewsFileData) => {
      // Transform uploadDate to time ago
      const timeAgoDate = formatTimeAgo(review.uploadDate.toString());
      return {
        ...review,
        uploadDate: timeAgoDate,
      };
    });

    return { success: reviewsTransformed };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving reviews from db",
    };
  }
};
