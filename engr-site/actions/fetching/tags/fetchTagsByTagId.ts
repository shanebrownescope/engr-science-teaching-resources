"use server";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";

/**
 * Fetches tags by tag id from the database
 * @param tagId - The id of the tag
 * @returns A promise that resolves to a FetchedFormattedData object
 * containing the fetched tag or an error message
 */
export const fetchTagsByTagId = async (
  tagId: string | number,
): Promise<FetchedFormattedData> => {
  try {
    const query = `
      SELECT * FROM Tags_v3 WHERE id = ?`;

    const { results } = await dbConnect(query, [tagId]);

    if (results[0].length > 0) {
      const formattedTagData: FormattedData[] = results[0].map(
        (item: { id: number; tagName: string }) =>
          lowercaseAndReplaceSpace(item.id, item.tagName),
      );
      return { success: formattedTagData, failure: undefined };
    }

    return { success: undefined, failure: "Tag not found" };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving tag from db",
      success: undefined,
    };
  }
};

export const fetchAllTags = async (): Promise<FetchedFormattedData> => {
  try {
    const query = `SELECT * FROM Tags_v3`;
    
    const { results } = await dbConnect(query);

    if (results[0].length > 0) {
      const formattedTagData: FormattedData[] = results[0].map(
        (item: { id: number; tagName: string }) =>
          lowercaseAndReplaceSpace(item.id, item.tagName),
      );
      return { success: formattedTagData, failure: undefined };
    }

    return { success: undefined, failure: "No tags found" };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving tags from db",
      success: undefined,
    };
  }
};