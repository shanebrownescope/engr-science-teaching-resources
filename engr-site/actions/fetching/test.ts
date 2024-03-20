"use server";

import { FileData } from "@/database/data/files";
import dbConnect from "@/database/dbConnector";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { processFile } from "@/utils/helpers";
import { FetchedFile } from "@/utils/types";

type fetchFilesByConceptIdProps = {
  id: string;
};

type FetchedFilesData = {
  success?: FetchedFile[];
  failure?: string;
};

export const testAction = async ({
  id,
}: fetchFilesByConceptIdProps): Promise<any> => {
  try {
    const selectQuery = `
    SELECT f.FileId, f.FileName, f.S3Url, f.Description, f.UploadDate, f.Contributor,
      JSON_ARRAYAGG(t.TagName) AS TagNames
    FROM Files f
    LEFT JOIN FileTags ft ON f.FileId = ft.FileId
    LEFT JOIN Tags t ON ft.TagId = t.TagId
    WHERE f.ConceptId = ?
    GROUP BY f.FileId;`;

    const { results, error } = await dbConnect(selectQuery, [id]);
    console.log(typeof results[0].TagNames);
    const formattedData: FetchedFile[] = await Promise.all(
      results[0].map(async (file: FileData) => {
        const processedFile = await processFile(file);
        return processedFile;
      })
    );

    return { success: formattedData };
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
