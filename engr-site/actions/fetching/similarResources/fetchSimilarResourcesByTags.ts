"use server";

import dbConnect from "@/database/dbConnector";
import { processFilesAndLinks } from "@/utils/helpers";
import { AllFilesAndLinksData, AllFilesAndLinksDataFormatted, FetchedSearchResults } from "@/utils/types_v2";

type fetchSimilarResourcesByTagsProps = {
  name: string;
  tags?: string[];
};

/**
 * Fetches similar resources from the database based on given tags
 * @param {fetchSimilarResourcesByTagsProps} props - An object containing the file/link name and tags to fetch similar resources by
 * @returns {Promise<FetchedSearchResults>} An object containing the fetched resources or an error message
 */
export const fetchSimilarResourcesByTags = async ({
  name,
  tags,
}: fetchSimilarResourcesByTagsProps): Promise<FetchedSearchResults> => {
  try {
    const selectQuery = `
      SELECT 
        'file' AS type,
        f.id,
        f.fileName AS name,
        f.description,
        f.uploadDate,
        c.contributorName AS contributor,
        f.resourceType,
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
          WHERE 
            ${tags?.length ? `t.tagName IN (${tags?.map(() => '?').join(',')})` : '1=0'}
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
      WHERE 
        FileTagConcat.fileId IS NOT NULL  -- Ensures files have at least one matching tag
        AND f.fileName NOT LIKE CONCAT('%\_', ?, '.%')
      GROUP BY f.id

      UNION

      SELECT 
        'link' AS type,
        l.id,
        l.linkName AS name,
        l.description,
        l.uploadDate,
        c.contributorName AS contributor,
        l.resourceType,
        IFNULL(LinkTagConcat.tagName, '') AS tags,
        IFNULL(LinkCourseTopicConcat.courseTopicNames, '') AS courseTopics,
        IFNULL(LinkCourseTopicConcat.courseNames, '') AS courses,
        l.avgRating,
        l.numReviews
      FROM 
        Links_v3 AS l
      LEFT JOIN 
        (
          SELECT 
            lt.linkId, 
            GROUP_CONCAT(t.tagName SEPARATOR ', ') AS tagName
          FROM 
            LinkTags_v3 AS lt
          JOIN 
            Tags_v3 AS t ON lt.tagId = t.id
          WHERE 
            ${tags?.length ? `t.tagName IN (${tags?.map(() => '?').join(',')})` : '1=0'}
          GROUP BY 
            lt.linkId
        ) AS LinkTagConcat
      ON 
        l.id = LinkTagConcat.linkId
      LEFT JOIN 
        Contributors_v3 AS c 
      ON 
        l.contributorId = c.id
      LEFT JOIN 
        (
          SELECT 
            ctl.linkId,
            GROUP_CONCAT(DISTINCT ct.courseTopicName SEPARATOR ', ') AS courseTopicNames,
            GROUP_CONCAT(DISTINCT co.courseName SEPARATOR ', ') AS courseNames
          FROM 
            CourseTopicLinks_v3 AS ctl
          LEFT JOIN 
            CourseTopics_v3 AS ct ON ctl.courseTopicId = ct.id
          LEFT JOIN 
            Courses_v3 AS co ON ct.courseId = co.id
          GROUP BY 
            ctl.linkId
        ) AS LinkCourseTopicConcat 
      ON 
        l.id = LinkCourseTopicConcat.linkId
      WHERE 
        LinkTagConcat.linkId IS NOT NULL  -- Ensures links have at least one matching tag
        AND l.linkName != ?
      GROUP BY l.id    

      LIMIT 4;
    `;

    const params = tags ? [...tags, name, ...tags, name] : [name, name];
    const { results: similarResources, error } = await dbConnect(selectQuery, params);

    if (error) {
      console.log("Error when fetching similar resources: ", error)
      return { failure: "Internal server error" };
    }

    if (similarResources[0].length > 0) {
      const formattedData: AllFilesAndLinksDataFormatted[] = await Promise.all(
        similarResources[0].map(async (resource: AllFilesAndLinksData) => {
          return processFilesAndLinks(resource);
        }),
      );

      return { success: formattedData };
      
    } else {
      return { success: undefined }; // No similar resources found
    }
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
