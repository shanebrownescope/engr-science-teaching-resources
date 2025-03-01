"use server";

import dbConnect from "@/database/dbConnector";
import { processFile } from "@/utils/helpers";
import { FileData, FetchedFile } from "@/utils/types_v2";

type fetchFilesByNameProps = {
  name: string;
};

export type FetchedFileData = {
  success?: FetchedFile;
  failure?: string;
};

/**
 * Asynchronously fetches a file from the database by its id
 * @param {fetchFilesByNameProps} props - An object containing the id of the file to fetch
 * @returns {Promise<FetchedFileData>} An object containing the fetched file or an error message
 */
export const fetchFileByName = async ({
  name
}: fetchFilesByNameProps): Promise<FetchedFileData> => {
  try {
    const selectQuery = `
      SELECT f.id, f.fileName, f.s3Url, f.uploadDate, f.contributor,
        JSON_ARRAYAGG(t.tagName) AS tagNames
      FROM Files_v3 f
      LEFT JOIN FileTags_v3 ft ON f.id = ft.fileId
      LEFT JOIN Tags_v3 t ON ft.tagId = t.id
      WHERE f.id = ?
      GROUP BY f.id;`;

    const { results: fileResult, error } = await dbConnect(selectQuery, [name]);

    if (error) {
      return { failure: "Internal server error" };
    }

    if (fileResult[0].length > 0) {
      const file: FileData = fileResult[0][0];

      const processedFile: FetchedFile = await processFile(file);

      return { success: processedFile };
    }

    return {
      failure: "No file found with that name",
    };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
