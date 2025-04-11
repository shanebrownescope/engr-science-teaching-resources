"use server";

import { fetchFileByName } from "@/actions/fetching/files/fetchFileByName";
import dbConnect from "@/database/dbConnector";
import { formatTimeAgo } from "@/utils/formatting";
import { CommentFileData, FetchedCommentFileData } from "@/utils/types_v2";

/**
 * Fetches comments for a file from the database by its name
 * @param {string} name - The name of the file
 * @returns {Promise<FetchedCommentFileData | null>} - A promise that resolves to an object containing the fetched comments or an error message
 */
export const fetchCommentsByFileName = async (
  name: string,
): Promise<FetchedCommentFileData | null> => {
  try {
    const existingFile = await fetchFileByName({ name });
    if (existingFile.failure) {
      return { failure: "File not found" };
    }

    const selectQuery = `
      SELECT fc.id, fc.fileId, fc.userId, fc.commentText, fc.uploadDate, u.name
      FROM FileComments_v3 AS fc 
      JOIN Users_v3 AS u ON fc.userId = u.id
      WHERE fc.fileId = ?`;

    const { results: comments, error } = await dbConnect(selectQuery, [ existingFile.success?.id ]);

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

    const commentsTransformed = comments[0].map((comment: CommentFileData) => {
      // Transform uploadDate to time ago
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
