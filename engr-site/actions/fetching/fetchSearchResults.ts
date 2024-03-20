"use server";

import dbConnect from "@/database/dbConnector";
import { processFilesAndLinks } from "@/utils/helpers";
import {
  AllFilesAndLinksData,
  AllFilesAndLinksDataFormatted,
  FetchedSearchResults,
} from "@/utils/types";

// Fetches files and links 

/**
    const combinedQuery = `
  (
    SELECT 'file' AS type, f.FileId AS id, f.FileName AS name, f.Description AS description, f.UploadDate as uploadDate,
      JSON_ARRAYAGG(t.TagName) AS tagNames
    FROM Files f
    JOIN FileTags ft ON f.FileId = ft.FileId
    JOIN Tags t ON ft.TagId = t.TagId
    GROUP BY f.FileId
    )

    UNION
  (
    SELECT 'link' AS type, l.LinkId AS id, l.LinkName AS name, l.Description AS description, l.UploadDate as uploadDate,
      JSON_ARRAYAGG(t.TagName) AS tagNames
    FROM Links l
    LEFT JOIN LinkTags lt ON l.LinkId = lt.LinkId
    LEFT JOIN Tags t ON lt.TagId = t.TagId
    GROUP BY l.LinkId
  );`;
 */


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
    'file' AS Type,
    Files.FileId AS Id,
    Files.FileName AS Name,
    Files.Description AS Description,
    Files.UploadDate AS UploadDate,
    Files.Contributor AS Contributor,
    IFNULL(GROUP_CONCAT(FileTagConcat.TagName SEPARATOR ', '), '') AS Tags
  FROM 
    Files
  LEFT JOIN 
    (
      SELECT 
        FileId, GROUP_CONCAT(Tags.TagName) AS TagName
      FROM 
        FileTags
      JOIN 
        Tags ON FileTags.TagId = Tags.TagId
      GROUP BY 
        FileId
    ) AS FileTagConcat
  ON 
    Files.FileId = FileTagConcat.FileId
  WHERE 
    ((FileTagConcat.TagName LIKE CONCAT('%', ?, '%') OR Files.FileName LIKE CONCAT('%', ?, '%')) OR (Files.FileName LIKE CONCAT('%', ?, '%') AND (FileTagConcat.TagName IS NULL OR FileTagConcat.TagName = '')))
  GROUP BY 
    Files.FileId

  UNION

  SELECT 
    'link' AS Type,
    Links.LinkId AS Id,
    Links.LinkName AS Name,
    Links.Description AS Description,
    Links.UploadDate AS UploadDate,
    Links.Contributor AS Contributor,
    IFNULL(GROUP_CONCAT(LinkTagConcat.TagName SEPARATOR ', '), '') AS Tags
  FROM 
    Links
  LEFT JOIN  
    (
      SELECT 
        LinkId, GROUP_CONCAT(Tags.TagName) AS TagName
      FROM 
        LinkTags
      JOIN 
        Tags ON LinkTags.TagId = Tags.TagId
      GROUP BY 
        LinkId
    ) AS LinkTagConcat
  ON 
    Links.LinkId = LinkTagConcat.LinkId
  WHERE 
    ((LinkTagConcat.TagName LIKE CONCAT('%', ?, '%') OR Links.LinkName LIKE CONCAT('%', ?, '%')) OR (Links.LinkName LIKE CONCAT('%', ?, '%') AND (LinkTagConcat.TagName IS NULL OR LinkTagConcat.TagName = '')))
  GROUP BY 
    Links.LinkId;
`;


export const fetchSearchResults = async (
  searchQuery: string
): Promise<FetchedSearchResults> => {
  try {

    const { results, error } = await dbConnect(fetchQuery, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (results[0].length > 0) {
      console.log("-- found");
      console.log("--result: ", results[0]);
      const formattedData: AllFilesAndLinksDataFormatted[] = results[0].map(
        (item: AllFilesAndLinksData) => {
          return processFilesAndLinks(item);
        }
      );

      // const filteredData: AllFilesAndLinksDataFormatted[] =
      //   formattedData.filter((item: AllFilesAndLinksDataFormatted) => {
      //     const titleSimilar = item.originalName
      //       .toLowerCase()
      //       .includes(searchQuery);

      //     const similarTags = item.tags.some((tag) =>
      //       tag.toLowerCase().includes(searchQuery)
      //     );

      //     if (titleSimilar || similarTags) {
      //       return item;
      //     }
      //   });

      return { success: formattedData, failure: undefined };
    }
    console.log("--not found");

    return { success: [] };
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
