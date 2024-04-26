"use server";

import dbConnect from "@/database/dbConnector";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { TagsData, fetchTagsByFileId } from "../fetchTagsByFileId";
import { processFile } from "@/utils/helpers";
import { FileData, FetchedFile } from "@/utils/types";

type fetchFilesByIdProps = {
  id: string;
};

export type FetchedFileData = {
  success?: FetchedFile;
  failure?: string;
};

export const fetchFileById = async ({
  id,
}: fetchFilesByIdProps): Promise<FetchedFileData> => {
  try {
    const selectQuery = `
      SELECT f.id, f.fileName, f.s3Url, f.description, f.uploadDate, f.contributor,
        JSON_ARRAYAGG(t.tagName) AS tagNames
      FROM Files_v2 f
      LEFT JOIN FileTags_v2 ft ON f.id = ft.fileId
      LEFT JOIN Tags_v2 t ON ft.tagId = t.id
      WHERE f.id = ?
      GROUP BY f.id;`;

    const { results: fileResult, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    console.log(fileResult[0]);

    if (fileResult[0].length > 0) {
      const file: FileData = fileResult[0][0];

      const processedFile: FetchedFile = await processFile(file);
      console.log("procesed file", processedFile);

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
