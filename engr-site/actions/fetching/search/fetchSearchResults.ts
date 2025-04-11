"use server";

import dbConnect from "@/database/dbConnector";
import { processFilesAndLinks } from "@/utils/helpers";
import {
  AllFilesAndLinksData,
  AllFilesAndLinksDataFormatted,
  FetchedSearchResults,
} from "@/utils/types_v2";

//* New query, uses GROUP_CONCAT
// Fetches files and links that match the search query
// The expression (f.FileName LIKE CONCAT('%', 'computer', '%'))   would work as follows:

// 1. CONCAT('%', 'computer', '%')
// This would result in the string '%computer%', where '%' is a
// wildcard that matches any sequence of characters.

// 2. f.FileName LIKE '%computer%'
// This expression would evaluate to true for any value of f.FileName
// that contains the word "computer" anywhere within it.

// So, when the query is executed with this condition,
// it would return rows where the FileName column
// contains the word "computer" in any position within its value.

const fetchQuery = `
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
    IFNULL(FileCourseTopicConcat.courseNames, '') AS courses
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
  WHERE 
    ((FileTagConcat.tagName LIKE CONCAT('%', ?, '%') OR f.fileName LIKE CONCAT('%', ?, '%')) OR (f.fileName LIKE CONCAT('%', ?, '%') AND (FileTagConcat.tagName IS NULL OR FileTagConcat.tagName = '')))
  GROUP BY 
    f.id

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
    IFNULL(LinkCourseTopicConcat.courseNames, '') AS courses
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
  ON l.id = LinkCourseTopicConcat.linkId
  WHERE 
    ((LinkTagConcat.tagName LIKE CONCAT('%', ?, '%') OR l.linkName LIKE CONCAT('%', ?, '%')) OR (l.linkName LIKE CONCAT('%', ?, '%') AND (LinkTagConcat.tagName IS NULL OR LinkTagConcat.tagName = '')))
  GROUP BY 
    l.id;
  `;

/**
 * Fetches search results from the database based on a search query
 * @param {string} searchQuery - The search query to match against file and link names and tags
 * @returns {Promise<FetchedSearchResults>} An object containing the fetched search results or an error message
 */
export const fetchSearchResults = async (
  searchQuery: string,
): Promise<FetchedSearchResults> => {
  try {
    // searchQuery is used multiple times in the query
    const { results, error } = await dbConnect(fetchQuery, [
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery,
    ]);

    if (error) {
      console.log("Error fetching search results: ", error)
      return { failure: "Internal server error" };
    }

    if (results[0].length > 0) {
      const formattedData: AllFilesAndLinksDataFormatted[] = results[0].map(
        (item: AllFilesAndLinksData) => {
          return processFilesAndLinks(item);
        },
      );

      return { success: formattedData, failure: undefined };
    }

    return { success: [] };

  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
