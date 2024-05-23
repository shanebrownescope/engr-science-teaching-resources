import dbConnect from "@/database/dbConnector";

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

export const getPendingUsers = async () => {
  try {
    const selectQuery = `
      SELECT * FROM Users_v2 WHERE accountStatus = 'pending'`;

    const { results: users, error } = await dbConnect(selectQuery);

    if (users[0].length > 0) {
      return users[0];
    }

    return null;
  } catch (error) {
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
