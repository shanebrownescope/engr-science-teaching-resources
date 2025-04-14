import dbConnect from "@/database/dbConnector";
import { UserData } from "@/utils/types";

// Define a type reflecting the actual DB structure
type RawUserDataFromDB = Omit<UserData, 'username'> & {
  name: string; // name instead of username
  // Add other fields if they differ from UserData, e.g., password if returned by SELECT *
  // password?: string;
};

export const getUserByEmail = async (email: string) => {
  try {
    const selectQuery = `
      SELECT * FROM Users_v2 WHERE email = ?`;

    const { results: user, error } = await dbConnect(selectQuery, [email]);

    if (user[0].length > 0) {
      return user[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const selectQuery = `
      SELECT * FROM Users_v2 WHERE id = ?`;

    const { results: user, error } = await dbConnect(selectQuery, [id]);

    if (user[0].length > 0) {
      return user[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getPendingUsers = async (): Promise<RawUserDataFromDB[] | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Users_v2 WHERE accountStatus = 'pending'`;

    const { results: users, error } = await dbConnect(selectQuery);

    // The result from dbConnect might be nested, ensure we return the correct array
    if (users && Array.isArray(users) && users.length > 0 && Array.isArray(users[0])) {
        // Assuming users[0] is the actual array of user objects
        return users[0] as RawUserDataFromDB[]; 
    }

    return null;
  } catch (error) {
    console.error("Error in getPendingUsers:", error); // Add error logging
    return null;
  }
};

export const fetchUserData = async () => {
  try {
    const selectQuery = `
      SELECT * FROM Users_v2`;

    const { results: user, error } = await dbConnect(selectQuery);

    if (user[0].length > 0) {
      return user[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};
