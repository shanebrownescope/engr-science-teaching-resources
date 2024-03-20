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
      SELECT l.LinkId, l.LinkName, l.LinkUrl, l.Description, l.UploadDate, l.Contributor,
        JSON_ARRAYAGG(t.TagName) AS TagNames
      FROM Links l
      LEFT JOIN LinkTags lt ON l.LinkId = lt.LinkId
      LEFT JOIN Tags t ON lt.TagId = t.TagId
      WHERE l.LinkId = ?
      GROUP BY l.LinkId;`;

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
