"use server";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import { ResourceTypeData } from "@/database/data/resourceTypes";


export const fetchResourceTypesByCourseTopicId = async (id: string | number): Promise<FetchedFormattedData> => {
  console.log(id);
  try {
    const query = `
      SELECT * FROM ResourceTypes_v2 WHERE courseTopicId = ?`;

    const { results } = await dbConnect(query, [id]);
    console.log(results[0]);

    if (results[0].length > 0) {
      const formattedResourceTypeData: FormattedData[] = results[0].map((item: ResourceTypeData) =>
        lowercaseAndReplaceSpace(item.id, item.resourceTypeName)
      );
      console.log("fetchResourceTypes results: ", formattedResourceTypeData);
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
