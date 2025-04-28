"use server";

import { fetchLinkByName } from "@/actions/fetching/links/fetchLinkByName";
import dbConnect from "@/database/dbConnector";
import { formatTimeAgo } from "@/utils/formatting";
import { ReviewsLinkData, FetchedReviewsLinkData } from "@/utils/types_v2";

/**
 * Fetches reviews for a link from the database by its name
 * @param {string} name - The name of the link
 * @returns {Promise<FetchedReviewsLinkData | null>} - A promise that resolves to an object containing the fetched reviews or an error message
 */
export const fetchReviewsByLinkName = async (
  name: string,
): Promise<FetchedReviewsLinkData | null> => {
  try {
    const existingLink = await fetchLinkByName({ name });
    if (existingLink.failure) {
      return { failure: "Link not found" };
    }

    const selectQuery = `
      SELECT lr.id, lr.linkId, lr.userId, lr.rating, lr.comments, lr.uploadDate, lr.title, lr.userPublicName
      FROM LinkReviews_v3 AS lr
      WHERE lr.linkId = ?
      ORDER BY lr.uploadDate DESC`
    ;

    const { results: reviews, error } = await dbConnect(selectQuery, [ existingLink.success?.id ]);

    if (error) {
      console.error("An error occurred while fetching reviews data:", error);
      return {
        failure:
          "Internal server error, error retrieving link reviews from db",
      };
    }

    // Return empty array if no reviews were found
    if (reviews[0].length === 0) {
      return {
        success: [],
      };
    }

    const reviewsTransformed = reviews[0].map((review: ReviewsLinkData) => {
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
