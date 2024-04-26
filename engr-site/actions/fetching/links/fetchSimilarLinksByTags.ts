"use server";

import dbConnect from "@/database/dbConnector";
import { processLink } from "@/utils/helpers";
import { LinkData, FetchedLink, FetchedLinksDataArray } from "@/utils/types";

type fetchSimilarLinksByTagsProps = {
  linkId?: string;
  tags?: string[];
};

export const fetchSimilarLinksByTags = async ({
  linkId,
  tags,
}: fetchSimilarLinksByTagsProps): Promise<FetchedLinksDataArray> => {
  try {
    const selectQuery = `
    SELECT l.id, l.linkName, l.linkUrl, l.description, l.uploadDate, l.contributor,
      JSON_ARRAYAGG(t.tagName) AS tagNames
    FROM Links_v2 l
    JOIN LinkTags_v2 lt ON l.id = lt.linkId
    JOIN Tags_v2 t ON lt.tagId = t.id
    WHERE t.tagName IN (${JSON.stringify(tags)
      .replace("[", "")
      .replace("]", "")})
      AND l.id != ?
    GROUP BY l.id
    LIMIT 3;`;

    const { results: linksResult, error } = await dbConnect(selectQuery, [
      linkId,
    ]);
    console.log("similar link results",linksResult);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (linksResult[0].length > 0) {
      const formattedData: FetchedLink[] = await Promise.all(
        linksResult[0].map(async (link: LinkData) => {
          const processedLink = await processLink(link);
          return processedLink;
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
