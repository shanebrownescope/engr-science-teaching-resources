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

export const fetchLinksByConceptId = async ({
  id,
}: fetchLinksByConceptIdProps): Promise<FetchedLinksDataArray> => {
  try {
    const selectQuery = `
      SELECT l.LinkId, l.LinkName, l.LinkUrl, l.Description, l.UploadDate, l.Contributor,
        JSON_ARRAYAGG(t.TagName) AS TagNames
      FROM Links l
      LEFT JOIN LinkTags lt ON l.LinkId = lt.LinkId
      LEFT JOIN Tags t ON lt.TagId = t.TagId
      WHERE l.ConceptId = ?
      GROUP BY l.LinkId;`;

    const { results, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
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
      return { success: undefined };
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
