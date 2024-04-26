"use server";

import dbConnect from "@/database/dbConnector";
import { processFile } from "@/utils/helpers";
import { FileData, FetchedFile, FetchedFilesDataArray } from "@/utils/types";

type fetchSimilarFilesByTagsProps = {
  fileId: string;
  tags?: string[];
};

export const fetchSimilarFilesByTags = async ({
  fileId,
  tags,
}: fetchSimilarFilesByTagsProps): Promise<FetchedFilesDataArray> => {
  console.log(tags);
  const tagsString = tags?.map((tag) => `'${tag}'`).join(",");
  console.log(tagsString);

  console.log(JSON.stringify(tags).replace("[", "").replace("]", ""));

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
      console.error("Error retrieving data from the database:", error);
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
      return { success: undefined };
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
