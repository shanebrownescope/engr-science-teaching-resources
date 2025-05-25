"use server";

import dbConnect from "@/database/dbConnector";
import { processFilesAndLinks } from "@/utils/helpers";
import { AllFilesAndLinksData, AllFilesAndLinksDataFormatted, FetchedSearchResults } from "@/utils/types_v2";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";

type fetchSimilarResourcesByTagsAndCourseTopicsProps = {
  name: string;
  tags: string[];
  courseTopics: string[]
};

/**
 * Fetches similar resources from the database based on given tags
 * @param {fetchSimilarResourcesByTagsProps} props - An object containing the file/link name and tags to fetch similar resources by
 * @returns {Promise<FetchedSearchResults>} An object containing the fetched resources or an error message
 */
export const fetchSimilarResourcesByTagsAndCourseTopics = async ({
  name,
  tags,
  courseTopics
}: fetchSimilarResourcesByTagsAndCourseTopicsProps): Promise<FetchedSearchResults> => {
  try {
    const hasTags = tags.length > 0;
    const hasCourseTopics = courseTopics.length > 0;

    const selectQuery = `
      SELECT 
        resource.*,
        (
          -- Score based on tag matches (higher weight)
          ${hasTags ? `(
            SELECT COUNT(*) 
            FROM Tags_v3 t
            LEFT JOIN FileTags_v3 ft ON ft.tagId = t.id AND resource.type = 'file'
            LEFT JOIN LinkTags_v3 lt ON lt.tagId = t.id AND resource.type = 'link'
            WHERE (ft.fileId = resource.id OR lt.linkId = resource.id)
            AND t.tagName IN (${tags.map(() => '?').join(',')})
          ) * 2 + ` : '0 + '}
          -- Score based on course topic matches
          ${hasCourseTopics ? `(
            SELECT COUNT(*)
            FROM CourseTopics_v3 ct
            LEFT JOIN CourseTopicFiles_v3 ctf ON ctf.courseTopicId = ct.id AND resource.type = 'file'
            LEFT JOIN CourseTopicLinks_v3 ctl ON ctl.courseTopicId = ct.id AND resource.type = 'link'
            WHERE (ctf.fileId = resource.id OR ctl.linkId = resource.id)
            AND ct.courseTopicName IN (${courseTopics.map(() => '?').join(',')})
          )` : '0'}
        ) AS similarity_score
      FROM 
      (
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
          Contributors_v3 AS c 
        ON 
          f.contributorId = c.id
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
          f.fileName NOT LIKE CONCAT('%\_', ?, '.%')

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
          Contributors_v3 AS c 
        ON 
          l.contributorId = c.id
        LEFT JOIN 
          (
            SELECT 
              lt.linkId, 
              GROUP_CONCAT(t.tagName SEPARATOR ', ') AS tagName
            FROM 
              LinkTags_v3 AS lt
            JOIN 
              Tags_v3 AS t ON lt.tagId = t.id
            GROUP BY 
              lt.linkId
          ) AS LinkTagConcat
        ON 
          l.id = LinkTagConcat.linkId
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
          l.linkName != ?
      ) AS resource
      HAVING 
        similarity_score > 0
      ORDER BY 
        similarity_score DESC,
        avgRating DESC
      LIMIT 4;
    `;

    // Build parameters array
    const params = [
      ...(hasTags ? tags : []),
      ...(hasCourseTopics ? courseTopics : []),
      name, // For files exclusion
      name  // For links exclusion
    ];

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

      console.log("TOTAL:", formattedData.length, "== ", formattedData)

      return { success: formattedData };
      
    } else {
      return { success: undefined }; // No similar resources found
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      failure: "Internal server error, error retrieving similar resources from db",
    };
  }
};
