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
    SELECT l.LinkId, l.LinkName, l.LinkUrl, l.Description, l.UploadDate, l.Contributor,
      JSON_ARRAYAGG(t.TagName) AS TagNames
    FROM Links l
    JOIN LinkTags lt ON l.LinkId = lt.LinkId
    JOIN Tags t ON lt.TagId = t.TagId
    WHERE t.TagName IN (${JSON.stringify(tags)
      .replace("[", "")
      .replace("]", "")})
      AND l.LinkId != ?
    GROUP BY l.LinkId
    LIMIT 3;`;

    const { results: linksResult, error } = await dbConnect(selectQuery, [
      linkId,
    ]);
    console.log(linksResult);

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
