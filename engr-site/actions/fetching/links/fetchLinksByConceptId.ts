"use server";

import dbConnect from "@/database/dbConnector";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { processFile, processLink } from "@/utils/helpers";
import {
  LinkData,
  FetchedFile,
  FetchedLink,
  FetchedLinksDataArray,
} from "@/utils/types";

type fetchLinksByConceptIdProps = {
  id: string;
};

/**
 * Asynchronously fetches links from the database by conceptId
 * @param {fetchLinksByConceptIdProps} props - An object containing the conceptId of the links to fetch
 * @returns {Promise<FetchedLinksDataArray>} An object containing the fetched links or an error message
 */
export const fetchLinksByConceptId = async ({
  id,
}: fetchLinksByConceptIdProps): Promise<FetchedLinksDataArray> => {
  try {
    const selectQuery = `
      SELECT l.id, l.linkName, l.linkUrl, l.description, l.uploadDate, l.contributor,
        JSON_ARRAYAGG(t.tagName) AS tagNames
      FROM Links_v2 l
      LEFT JOIN LinkTags_v2 lt ON l.id = lt.linkId
      LEFT JOIN Tags_v2 t ON lt.tagId = t.id
      WHERE l.conceptId = ?
      GROUP BY l.id;`;

    const { results, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      return { failure: "Internal server error" };
    }

    if (results[0].length > 0) {
      const formattedData: FetchedLink[] = await Promise.all(
        results[0].map(async (link: LinkData) => {
          const processedFile = await processLink(link);
          return processedFile;
        })
      );

      return { success: formattedData };
    } else {
      return { success: undefined }; // no links found
    }
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
