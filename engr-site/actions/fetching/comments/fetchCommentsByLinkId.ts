"use server"

import { getFileById } from "@/database/data/files";
import { getLinkById } from "@/database/data/links";
import dbConnect from "@/database/dbConnector";
import { formatTimeAgo } from "@/utils/formatting";
import { CommentLinkData, FetchedCommentLinkData } from "@/utils/types";



export const fetchCommentsByLinkId = async (id: string): Promise<FetchedCommentLinkData | null> => {
  try {
    const existingLink = getLinkById(id);

    if (!existingLink) {
      console.error("link not found");
      return { failure: "link not found" };
    }


    const selectQuery = `
      SELECT lc.id, lc.linkId, lc.userId, lc.commentText, lc.uploadDate, u.name
      FROM LinkComments_v2 AS lc 
      JOIN Users_v2 AS u ON lc.userId = u.id
      WHERE lc.linkId = ?`;

    const { results: comments, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("An error occurred while fetching data:", error);
      return {
        failure: "Internal server error, error retrieving file comments from db",
      };
    }

    if (comments[0].length === 0) {
      return {
        success: []
      }
    }

    console.log("date: ", comments[0][0].uploadDate);
    
    const commentsTransformed = comments[0].map((comment: CommentLinkData) => {
      const timeAgoDate = formatTimeAgo(comment.uploadDate.toString());
      return {
        ...comment,
        uploadDate: timeAgoDate

      } 
    })

    return { success: commentsTransformed };


  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};