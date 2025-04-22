"use server";

import dbConnect from "@/database/dbConnector";
import { processFile } from "@/utils/helpers";
import { FileData, FetchedFile } from "@/utils/types_v2";

type fetchFileByNameProps = {
  name: string;
};

export type FetchedFileData = {
  success?: FetchedFile;
  failure?: string;
};

/**
 * Asynchronously fetches a file from the database by its name
 * @param {fetchFileByNameProps} props - An object containing the name of the file to fetch
 * @returns {Promise<FetchedFileData>} An object containing the fetched file or an error message
 */
export const fetchFileByName = async ({
  name
}: fetchFileByNameProps): Promise<FetchedFileData> => {
  try {
    const selectQuery = `
      SELECT 
        'file' AS type,
        f.id,
        f.fileName,
        f.s3Url,
        f.description,
        f.uploadDate,
        c.contributorName AS contributor,
        f.resourceType,
        f.uploadedUserId,
        IFNULL(FileTagConcat.tagName, '') AS tags,
        IFNULL(FileCourseTopicConcat.courseTopicNames, '') AS courseTopics,
        IFNULL(FileCourseTopicConcat.courseNames, '') AS courses,
        f.avgRating,
        f.numReviews
      FROM 
        Files_v3 AS f
      LEFT JOIN 
        (
          SELECT 
            ft.fileId, 
            GROUP_CONCAT(t.tagName SEPARATOR ', ') AS tagName
          FROM 
            FileTags_v3 AS ft
          JOIN 
            Tags_v3 AS t ON ft.tagId = t.id
          GROUP BY 
            ft.fileId
        ) AS FileTagConcat
      ON 
        f.id = FileTagConcat.fileId
      LEFT JOIN 
        Contributors_v3 AS c 
      ON 
        f.contributorId = c.id
      LEFT JOIN 
        (
          SELECT 
            ctf.fileId,
            GROUP_CONCAT(DISTINCT ct.courseTopicName SEPARATOR ', ') AS courseTopicNames,
            GROUP_CONCAT(DISTINCT co.courseName SEPARATOR ', ') AS courseNames
          FROM 
            CourseTopicFiles_v3 AS ctf
          LEFT JOIN 
            CourseTopics_v3 AS ct ON ctf.courseTopicId = ct.id
          LEFT JOIN 
            Courses_v3 AS co ON ct.courseId = co.id
          GROUP BY 
            ctf.fileId
        ) AS FileCourseTopicConcat 
      ON 
        f.id = FileCourseTopicConcat.fileId
      WHERE f.fileName LIKE CONCAT('%\_', ?, '.%')
      GROUP BY 
        f.id
    `;

    const { results: fileResult, error } = await dbConnect(selectQuery, [name]);

    if (error) {
      console.log("Error when fetching file: ", error)
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
