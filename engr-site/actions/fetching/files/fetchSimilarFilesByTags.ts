"use server";

import dbConnect from "@/database/dbConnector";
import { processFile } from "@/utils/helpers";
import { FileData, FetchedFile, FetchedFilesDataArray } from "@/utils/types";

type fetchSimilarFilesByTagsProps = {
  fileId: string;
  tags?: string[];
};

/**
 * Fetches similar files from the database based on given tags
 * @param {fetchSimilarFilesByTagsProps} props - An object containing the fileId and tags to fetch similar files by
 * @returns {Promise<FetchedFilesDataArray>} An object containing the fetched files or an error message
 */
export const fetchSimilarFilesByTags = async ({
  fileId,
  tags,
}: fetchSimilarFilesByTagsProps): Promise<FetchedFilesDataArray> => {

  const tagsString = tags?.map((tag) => `'${tag}'`).join(",");
  console.log(tagsString);

  try {
    const selectQuery = `
      SELECT f.id, f.fileName, f.s3Url, f.description, f.uploadDate, f.contributor,
        JSON_ARRAYAGG(t.tagName) AS tagNames
      FROM Files_v2 f
      JOIN FileTags_v2 ft ON f.id = ft.fileId
      JOIN Tags_v2 t ON ft.tagId = t.id
      WHERE t.tagName IN (${JSON.stringify(tags)
        .replace("[", "")
        .replace("]", "")})
        AND f.id != ?
      GROUP BY f.id
      LIMIT 3;`;

    const { results: filesResult, error } = await dbConnect(selectQuery, [
      fileId,
    ]);

    if (error) {
      return { failure: "Internal server error" };
    }

    if (filesResult[0].length > 0) {
      const formattedData: FetchedFile[] = await Promise.all(
        filesResult[0].map(async (file: FileData) => {
          const processedFile = await processFile(file);
          return processedFile;
        })
      );

      return { success: formattedData };
    } else {
      return { success: undefined }; // No similar files found
    }
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
