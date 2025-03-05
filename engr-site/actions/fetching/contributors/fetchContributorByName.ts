"use server";

import dbConnect from "@/database/dbConnector";

type fetchContributorByNameProps = {
  name: string;
};

export type FetchedContributorData = {
  success?: any;
  failure?: string;
};

/**
 * Asynchronously fetches a file from the database by its id
 * @param {fetchContributorByNameProps} props - An object containing the name of the contributor to fetch
 * @returns {Promise<FetchedContributorData>} An object containing the fetched contributor or an error message
 */
export const fetchContributorByName = async ({
  name
}: fetchContributorByNameProps): Promise<FetchedContributorData> => {
  try {
    const selectQuery = `
      SELECT * FROM Contributors_v3 WHERE contributorName = ?;`;

    const { results: contributorResult, error } = await dbConnect(selectQuery, [name]);

    if (error) {
      return { failure: "Internal server error" };
    }

    if (contributorResult[0].length > 0) {
      const contributor: any = contributorResult[0][0];

      return { success: contributor };
    }

    return {
      failure: "No file found with that name",
    };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
