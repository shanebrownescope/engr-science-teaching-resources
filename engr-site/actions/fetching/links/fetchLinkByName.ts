"use server";

import dbConnect from "@/database/dbConnector";
import { processLink } from "@/utils/helpers";
import { LinkData, FetchedLink } from "@/utils/types_v2";

type fetchLinkByNameProps = {
  name: string;
};

export type FetchedLinkData = {
  success?: FetchedLink;
  failure?: string;
};

/**
 * Asynchronously fetches a link from the database by its name
 * @param {fetchLinkByNameProps} props - An object containing the name of the link to fetch
 * @returns {Promise<FetchedLinkData>} An object containing the fetched link or an error message
 */
export const fetchLinkByName = async ({
  name
}: fetchLinkByNameProps): Promise<FetchedLinkData> => {
  try {
    const selectQuery = `
      SELECT l.id, l.linkName, l.linkUrl, l.uploadDate, c.contributorName,
        JSON_ARRAYAGG(t.tagName) AS tagNames
      FROM Links_v3 l
      LEFT JOIN LinkTags_v3 lt ON l.id = lt.linkId
      LEFT JOIN Tags_v3 t ON lt.tagId = t.id
      LEFT JOIN Contributors_v3 c ON l.contributorId = c.id
      WHERE l.linkName = ?`;

    const { results: linkResult, error } = await dbConnect(selectQuery, [name]);

    if (error) {
      return { failure: "Internal server error" };
    }

    if (linkResult[0].length > 0) {
      const link: LinkData = linkResult[0][0];

      const processedLink: FetchedLink = await processLink(link);

      return { success: processedLink };
    }

    return {
      failure: "No link found with that name",
    };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
