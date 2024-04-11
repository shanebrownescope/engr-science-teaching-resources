"use server"

import { getPendingUsers } from "@/database/data/user"
import { transformObjectKeys } from "@/utils/helpers"
import { FetchedUserData, UserData } from "@/utils/types"

export const fetchPendingUsers = async () => {
    try {
      // const selectQuery = `
      //   SELECT * FROM Users WHERE AccountStatus = 'pending';
      // `;
      const results: UserData[] = await getPendingUsers()

      if (!results) {
        return { failure: "No pending users" };
      }

      const formattedUsers: FetchedUserData[] = results.map((user: UserData) => {
        return transformObjectKeys(user)
      })

      console.log("pending formattedUsers: ", formattedUsers)
      // const results = dbConnect(selectQuery)

      return { success: formattedUsers };


    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      return {
        failure: "Internal server error, error retrieving modules from db",
      };
    }
}