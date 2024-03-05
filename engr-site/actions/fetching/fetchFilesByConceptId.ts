"use server";


import { FileData, fetchedFilesDataArray } from "@/utils/types";
import dbConnect from "@/database/dbConnector";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { processFile } from "@/utils/helpers";
import { fetchedFile } from "@/utils/types"

type fetchFilesByConceptIdProps = {
  id: string;
};


export const fetchFilesByConceptId = async ({
  id,
}: fetchFilesByConceptIdProps): Promise<fetchedFilesDataArray> => {
  try {
  
    const selectQuery = `
      SELECT f.FileId, f.FileName, f.S3Url, f.Description, f.UploadDate, f.Contributor,
        JSON_ARRAYAGG(t.TagName) AS TagNames
      FROM Files f
      LEFT JOIN FileTags ft ON f.FileId = ft.FileId
      LEFT JOIN Tags t ON ft.TagId = t.TagId
      WHERE f.ConceptId = ?
      GROUP BY f.FileId;`
      
    const { results, error } = await dbConnect(selectQuery, [id]);

    console.log(results[0][0].TagNames)

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (results[0].length > 0) {
      const formattedData: fetchedFile[] = await Promise.all(results[0].map(async (file: FileData) => {
        const processedFile = await processFile(file);
        return processedFile;
      }));
  
      return { success: formattedData}
    } else {
      return { success: undefined}
    }
   
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
