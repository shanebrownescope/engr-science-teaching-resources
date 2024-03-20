"use server";

import dbConnect from "@/database/dbConnector";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { TagsData, fetchTagsByFileId } from "./fetchTagsByFileId";
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
      SELECT f.FileId, f.FileName, f.S3Url, f.Description, f.UploadDate, f.Contributor,
        JSON_ARRAYAGG(t.TagName) AS TagNames
      FROM Files f
      LEFT JOIN FileTags ft ON f.FileId = ft.FileId
      LEFT JOIN Tags t ON ft.TagId = t.TagId
      WHERE f.FileId = ?
      GROUP BY f.FileId;`;

    const { results: fileResult, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    console.log(fileResult[0]);

    if (fileResult[0].length > 0) {
      const file: FileData = fileResult[0][0];

      const processedFile: FetchedFile = await processFile(file);
      console.log(processedFile);

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
