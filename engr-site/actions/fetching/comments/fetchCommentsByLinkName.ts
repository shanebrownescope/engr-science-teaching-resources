"use server";

import dbConnect from "@/database/dbConnector";
import { formatTimeAgo } from "@/utils/formatting";
import { CommentLinkData, FetchedCommentLinkData } from "@/utils/types";
import { fetchLinkByName } from "../links/fetchLinkByName";

/**
 * Fetches comments for a link from the database by its name
 * @param {string} name - The name of the link
 * @returns {Promise<FetchedCommentLinkData | null>} - A promise that resolves to an object containing the fetched comments or an error message
 */
export const fetchCommentsByLinkName = async (
  name: string,
): Promise<FetchedCommentLinkData | null> => {
  try {
    const existingLink = await fetchLinkByName({ name });
    if (existingLink.failure) {
      return { failure: "Link not found" };
    }

    const selectQuery = `
      SELECT lc.id, lc.linkId, lc.userId, lc.commentText, lc.uploadDate, u.name
      FROM LinkComments_v3 AS lc 
      JOIN Users_v3 AS u ON lc.userId = u.id
      WHERE lc.linkId = ?`;

    const { results: comments, error } = await dbConnect(selectQuery, [ existingLink?.success?.id ]);

    if (error) {
      console.error("An error occurred while fetching comment data:", error);
      return {
        failure:
          "Internal server error, error retrieving file comments from db",
      };
    }

    // Return empty array if no comments were found
    if (comments[0].length === 0) {
      return {
        success: [],
      };
    }

    // Transform uploadDate to time ago and return fetched comments
    const commentsTransformed = comments[0].map((comment: CommentLinkData) => {
      const timeAgoDate = formatTimeAgo(comment.uploadDate.toString());
      return {
        ...comment,
        uploadDate: timeAgoDate,
      };
    });

    return { success: commentsTransformed };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
