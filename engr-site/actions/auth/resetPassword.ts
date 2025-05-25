"use server";

import { getPasswordResetTokenByToken } from "@/database/data/password-reset-tokens";
import { getUserById } from "@/database/data/user";
import { ResetPasswordSchema } from "@/schemas";
import { PasswordResetTokenData, UserData } from "@/utils/types";
import * as z from "zod";
import bcrypt from "bcryptjs";
import dbConnect from "@/database/dbConnector";
import { transporter } from "@/utils/email";

/**
 * Resets the user's password given a valid password reset token
 *
 * @param values - The new password and password reset token
 * @param token - The password reset token
 * @returns - An object with the status of the operation and a success message if successful
 */
export const resetPasswordAction = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { failure: "Missing token!" };
  }

  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { failure: "Invalid password!" };
  }

  const { password } = validatedFields.data;

  const existingToken: PasswordResetTokenData =
    await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { failure: "Invalid token!" };
  }

  const isExpired = new Date(existingToken.expiresAt) < new Date();

  if (isExpired) {
    return { failure: "Token expired!" };
  }

  const existingUser: UserData = await getUserById(existingToken.userId);

  if (!existingUser) {
    return { failure: "User does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updateQuery = `
    UPDATE Users_v3
    SET password = ?
    WHERE id = ?`;

  const { error } = await dbConnect(updateQuery, [
    hashedPassword,
    existingUser.id,
  ]);

  if (error) {
    return { failure: "Failed to update password!" };
  }

  const deleteQuery = `
    DELETE FROM PasswordResetTokens_v3
    WHERE userId = ? AND id = ?`;

  await dbConnect(deleteQuery, [existingUser.id, existingToken.id]);

  await sendUpdatePasswordEmail(
    existingUser.email,
    existingUser.firstName,
    existingUser.lastName,
  );

  return { success: "Password updated!" };
};

/**
 * Sends an email to the user confirming that their password has been updated.
 *
 * @param {string} email - The email address of the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @returns {Promise<{success: string, messageId: string} | {failure: string, error: Error}>} - A promise that resolves to an object with the status of the operation and the message ID if successful.
 */
const sendUpdatePasswordEmail = async (
  email: string,
  firstName: string,
  lastName: string,
) => {
  const sendUpdatePasswordEmailContent = `
    <p>Dear ${firstName} ${lastName},</p>
    <p> This is to inform you that the password for your account has been successfully changed. </p>
    <p> If you recently changed your password, you can disregard this message. However, if you did not authorize this change or if you have any concerns about the security of your account, please contact our support team immediately at [Support Email or Phone Number]. </p>
    <p>Best regards,<br/> ${process.env.TEAM_NAME} </p>`;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: `Password Change Notification`,
    html: sendUpdatePasswordEmailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return { success: "password update email sent", messageId: info.messageId };
  } catch (error) {
    return { failure: "Failed to send email", error: error };
  }
};
