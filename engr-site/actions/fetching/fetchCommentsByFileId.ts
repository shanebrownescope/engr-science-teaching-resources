"use server"

import dbConnect from "@/database/dbConnector";

export const fetchCommentsByFileId = async (id: string) => {
  try {
    const selectQuery = `
    SELECT * FROM Files WHERE FileId = ?`;

    const { results: fileResult, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    console.log(fileResult[0]);

    if (fileResult[0].length > 0) {
      const file = fileResult[0][0]

      const processedFile = await processFile(file)
      console.log(processedFile)

      return { success: processedFile };
    }

    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};