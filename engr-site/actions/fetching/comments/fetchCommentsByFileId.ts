"use server"

import { getFileById } from "@/database/data/files";
import dbConnect from "@/database/dbConnector";
import { formatTimeAgo } from "@/utils/formatting";
import { CommentFileData, FetchedCommentFileData } from "@/utils/types";



/**
 * Fetches comments for a file from the database by its id
 * @param {string} id - The id of the file
 * @returns {Promise<FetchedCommentFileData | null>} - A promise that resolves to an object containing the fetched comments or an error message
 */
export const fetchCommentsByFileId = async (id: string): Promise<FetchedCommentFileData | null> => {
  try {
    const existingFile = getFileById(id);
    if (!existingFile) {
      return { failure: "File not found" }; 
    }

    const selectQuery = `
      SELECT fc.id, fc.fileId, fc.userId, fc.commentText, fc.uploadDate, u.name
      FROM FileComments_v2 AS fc 
      JOIN Users_v2 AS u ON fc.userId = u.id
      WHERE fc.fileId = ?`;

    const { results: comments, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      return {
        failure: "Internal server error, error retrieving file comments from db",
      };
    }

    // Return empty array if no comments were found
    if (comments[0].length === 0) {
      return {
        success: []
      }
    }
    
    const commentsTransformed = comments[0].map((comment: CommentFileData) => {
      // Transform uploadDate to time ago
      const timeAgoDate = formatTimeAgo(comment.uploadDate.toString());
      return {
        ...comment,
        uploadDate: timeAgoDate
      } 
    })

    return { success: commentsTransformed }; 
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    }; 
  }
};
