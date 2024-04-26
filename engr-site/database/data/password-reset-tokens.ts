import dbConnect from "../dbConnector";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const selectQuery = `
      SELECT * FROM PasswordResetTokens_v2 WHERE token = ?`;
    
    const { results: passwordToken, error } = await dbConnect(selectQuery, [token]);
    console.log(" passwordToken",passwordToken[0])
    if (passwordToken[0].length > 0) {
      return passwordToken[0][0]
    }

    return null;
  } catch (error) {
    return null
  }
}

export const getPasswordResetTokenByUserId = async (userId: string) => {
  try {
    const selectQuery = `
      SELECT * FROM PasswordResetTokens_v2 WHERE userId = ?`;
    
    const { results: passwordToken } = await dbConnect(selectQuery, [userId]);

    if (passwordToken[0].length > 0) {
      return passwordToken[0][0]
    }

    return null;
  } catch (error) {
    return null
  }
}