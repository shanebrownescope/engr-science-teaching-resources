"use server";

import dbConnect from "@/database/dbConnector";
import { processFilesAndLinks } from "@/utils/helpers";
import {
  AllFilesAndLinksData,
  AllFilesAndLinksDataFormatted,
  FetchedSearchResults,
} from "@/utils/types";

//* old query, uses JSON_ARRAYAGG
//   const combinedQuery = `
// (
//   SELECT 'file' AS type, f.FileId AS id, f.FileName AS name, f.Description AS description, f.UploadDate as uploadDate,
//     JSON_ARRAYAGG(t.TagName) AS tagNames
//   FROM Files f
//   JOIN FileTags ft ON f.FileId = ft.FileId
//   JOIN Tags t ON ft.TagId = t.TagId
//   GROUP BY f.FileId
//   )

//   UNION
// (
//   SELECT 'link' AS type, l.LinkId AS id, l.LinkName AS name, l.Description AS description, l.UploadDate as uploadDate,
//     JSON_ARRAYAGG(t.TagName) AS tagNames
//   FROM Links l
//   LEFT JOIN LinkTags lt ON l.LinkId = lt.LinkId
//   LEFT JOIN Tags t ON lt.TagId = t.TagId
//   GROUP BY l.LinkId
// );`;

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
    f.contributor,
    IFNULL(GROUP_CONCAT(FileTagConcat.tagName SEPARATOR ', '), '') AS tags
  FROM 
    Files_v2 AS f
  LEFT JOIN 
    (
      SELECT 
        fileId, GROUP_CONCAT(t.tagName) AS tagName
      FROM 
        FileTags_v2 AS ft
      JOIN 
        Tags_v2 AS t ON ft.tagId = t.id
      GROUP BY 
        fileId
    ) AS FileTagConcat
  ON 
    f.id = FileTagConcat.fileId
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
    l.contributor,
    IFNULL(GROUP_CONCAT(LinkTagConcat.tagName SEPARATOR ', '), '') AS tags
  FROM 
    Links_v2 AS l
  LEFT JOIN  
    (
      SELECT 
        linkId, GROUP_CONCAT(t.tagName) AS tagName
      FROM 
        LinkTags_v2 AS lt
      JOIN 
        Tags_v2 AS t ON lt.tagId = t.id
      GROUP BY 
        linkId
    ) AS LinkTagConcat
  ON 
    l.id = LinkTagConcat.linkId
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
