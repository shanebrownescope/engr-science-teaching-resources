"use server"

import dbConnect from "@/database/dbConnector";
import { processLink } from "@/utils/helpers";
import { LinkData, fetchedLink, fetchedLinksDataArray } from "@/utils/types";


type fetchSimilarLinksByTagsProps = {
  tags?: string[];
};



export const fetchSimilarLinksByTags = async ({
  tags,
}: fetchSimilarLinksByTagsProps): Promise<fetchedLinksDataArray> => {
  try {
    const selectQuery = `
    SELECT l.LinkId, l.LinkName, l.LinkUrl, l.Description, l.UploadDate, l.Contributor,
      JSON_ARRAYAGG(t.TagName) AS TagNames
    FROM Links l
    JOIN LinkTags lt ON l.LinkId = lt.LinkId
    JOIN Tags t ON lt.TagId = t.TagId
    WHERE t.TagName IN  (${JSON.stringify(tags).replace("[", "").replace("]", "")})
    GROUP BY l.LinkId
    LIMIT 3;`

    const { results: linksResult, error } = await dbConnect(selectQuery, [tags]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (linksResult[0].length > 0) {
      const formattedData: fetchedLink[] = await Promise.all(linksResult[0].map(async (link: LinkData) => {
        const processedLink = await processLink(link);
        return processedLink;
      }));
  
      return { success: formattedData}
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
