"use server"

import { getPendingUsers } from "@/database/data/user"
import { transformObjectKeys } from "@/utils/helpers"
import { FetchedUserData, UserData } from "@/utils/types"

/**
 * Fetches all pending users from the database
 * @returns {Promise<{success: UserData[]} | {failure: string}>} - A promise that resolves to an object containing the fetched users or an error message
 */
export const fetchPendingUsers = async (): Promise<{success: UserData[]} | {failure: string}> => {
  try {
    const results: UserData[] = await getPendingUsers()

    if (!results) {
      return { failure: "No pending users" };
    }

    return { success: results };

  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
}
