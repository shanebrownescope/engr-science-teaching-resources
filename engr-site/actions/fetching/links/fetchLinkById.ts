"use server";

import dbConnect from "@/database/dbConnector";
import { processLink } from "@/utils/helpers";
import { LinkData, FetchedLink } from "@/utils/types";

type fetchLinkByIdProps = {
  id: string;
};

type FetchedLinkData = {
  success?: FetchedLink;
  failure?: string;
};

export const fetchLinkById = async ({
  id,
}: fetchLinkByIdProps): Promise<FetchedLinkData> => {
  try {
    const selectQuery = `
      SELECT l.id, l.linkName, l.linkUrl, l.description, l.uploadDate, l.contributor,
        JSON_ARRAYAGG(t.tagName) AS tagNames
      FROM Links_v2 l
      LEFT JOIN LinkTags_v2 lt ON l.id = lt.linkId
      LEFT JOIN Tags_v2 t ON lt.tagId = t.id
      WHERE l.id = ?
      GROUP BY l.id;`;

    const { results: linkResult, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    console.log(linkResult[0]);

    if (linkResult[0].length > 0) {
      const link: LinkData = linkResult[0][0];

      const processedLink: FetchedLink = await processLink(link);
      console.log(processedLink);

      return { success: processedLink };
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
