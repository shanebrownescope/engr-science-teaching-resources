"use server";

import { getPendingUsers } from "@/database/data/user";
import { UserData } from "@/utils/types";

type ExtendedUserData = Omit<UserData, 'username'> & {
  name: string;
};

export type FetchPendingUsersData =
  | { success: ExtendedUserData[] }
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

    const transformedResults: ExtendedUserData[] = results.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      name: user.name,
      accountStatus: user.accountStatus,
      role: user.role
    }));

    return { success: transformedResults };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
