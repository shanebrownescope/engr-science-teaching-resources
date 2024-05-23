"use server";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import { ResourceTypeData } from "@/database/data/resourceTypes";

/**
 * Fetches resource types by course topic id from the database
 * @param id - The id of the course topic
 * @returns A promise that resolves to a FetchedFormattedData object
 * containing the fetched resource types or an error message
 */
export const fetchResourceTypesByCourseTopicId = async (
  id: string | number
): Promise<FetchedFormattedData> => {
  try {
    const query = `
      SELECT * FROM ResourceTypes_v2 WHERE courseTopicId = ?`;

    const { results } = await dbConnect(query, [id]);

    if (results[0].length > 0) {
      const formattedResourceTypeData: FormattedData[] = results[0].map(
        (item: ResourceTypeData) =>
          lowercaseAndReplaceSpace(item.id, item.resourceTypeName)
      );

      return { success: formattedResourceTypeData, failure: undefined };
    }

    return { failure: "failed", success: undefined };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
      success: undefined,
    };
  }
};
