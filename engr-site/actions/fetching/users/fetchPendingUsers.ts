"use server";

import { getPendingUsers } from "@/database/data/user";
import { UserData } from "@/utils/types_v2";

export type FetchPendingUsersData =
  | { success: UserData[] }
  | { failure: string };

/**
 * Fetches all pending users from the database
 * @returns {Promise<FetchPendingUsersData>} - A promise that resolves to an object containing the fetched users or an error message
 */
export const fetchPendingUsers = async (): Promise<FetchPendingUsersData> => {
  try {
    const results: UserData[] = await getPendingUsers();

    if (!results || results.length === 0) {
      return { failure: "No pending users" };
    }

    return { success: results };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
