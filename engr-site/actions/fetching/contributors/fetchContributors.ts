"use server";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types_v2";

/**
 * Fetches contributors from the database.
 *
 * @return {Promise<FetchedFormattedData>} A promise that resolves to a FetchedFormattedData object containing the fetched contributors or an error message.
 */
export const fetchContributors = async (): Promise<FetchedFormattedData> => {
  try {
    let query = `SELECT * FROM Contributors_v3`;

    const { results, error } = await dbConnect(query);

    if (results[0].length > 0) {
      const formattedContributorData: FormattedData[] = results[0].map(
        (item: any) =>
          lowercaseAndReplaceSpace(item.id, item.contributorName),
      );
      return { success: formattedContributorData, failure: undefined };
    }
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving contributors from db",
      success: undefined,
    };
  }
  return {
    failure: "Internal server error, error retrieving contributors from db",
    success: undefined,
  };
};
