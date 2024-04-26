"use server";

import { FileData, FetchedFilesDataArray } from "@/utils/types";
import dbConnect from "@/database/dbConnector";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { processFile } from "@/utils/helpers";
import { FetchedFile } from "@/utils/types";

type fetchFilesByConceptIdProps = {
  id: string;
};

export const fetchFilesByConceptId = async ({
  id,
}: fetchFilesByConceptIdProps): Promise<FetchedFilesDataArray> => {
  try {
    const selectQuery = `
      SELECT f.id, f.fileName, f.s3Url, f.description, f.uploadDate, f.contributor,
        JSON_ARRAYAGG(t.tagName) AS tagNames
      FROM Files_v2 f
      LEFT JOIN FileTags_v2 ft ON f.id = ft.fileId
      LEFT JOIN Tags_v2 t ON ft.tagId = t.id
      WHERE f.conceptId = ? 
      GROUP BY f.id;`;

    const { results, error } = await dbConnect(selectQuery, [id]);

    console.log("--- results ",results[0] && results[0][0]);
    console.log("- - type of tagNames: ", results[0] && typeof(results[0][0]?.tagNames));

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (results[0].length > 0) {
      const formattedData: FetchedFile[] = await Promise.all(
        results[0].map(async (file: FileData) => {
          const processedFile = await processFile(file);
          return processedFile;
        })
      );

      return { success: formattedData };
    } else {
      return { success: undefined };
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
