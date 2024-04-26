"use server";

import { getPasswordResetTokenByToken } from "@/database/data/password-reset-tokens";
import { getUserById } from "@/database/data/user";
import { ResetPasswordSchema } from "@/schemas";
import { transformObjectKeys } from "@/utils/helpers";
import { PasswordResetTokenData, TransformedPasswordResetToken, UserData } from "@/utils/types";
import * as z from "zod";
import bcrypt from "bcryptjs";
import dbConnect from "@/database/dbConnector";
import { transporter } from "@/utils/email";

export const resetPasswordAction = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null,
) => {
  console.log(token)
  if (!token) {
    return { failure: "Missing token!" };
  }

  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { failure: "Invalid password!" };
  }

  const { password } = validatedFields.data;

  const existingToken: PasswordResetTokenData = await getPasswordResetTokenByToken(token);
  console.log(existingToken);

  if (!existingToken) {
    return { failure: "Invalid token!" };
  }


  const isExpired = new Date(existingToken.expiresAt) < new Date();

  if (isExpired) {
    return { failure: "Token expired!" };
  }

  const existingUser: UserData = await getUserById(existingToken.userId);
  console.log("existingUser: ", existingUser)
  
  if (!existingUser) {
    return { failure: "User does not exist!" };
  }  

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashedPassword: ", hashedPassword)

  const updateQuery = `
    UPDATE Users_v2
    SET password = ?
    WHERE id = ?`;

  const { results, error } = await dbConnect(updateQuery, [hashedPassword, existingUser.id]);

  if (error) {
    return { failure: "Failed to update password!" };
  }

  const deleteQuery = `
    DELETE FROM PasswordResetTokens_v2
    WHERE userId = ? AND id = ?`;

  console.log("existingToken.id: ", existingToken.id)
  await dbConnect(deleteQuery, [existingUser.id, existingToken.id]);

  await sendUpdatePasswordEmail(existingUser.email, existingUser.firstName, existingUser.lastName);

  return { success: "Password updated!" };
};


const sendUpdatePasswordEmail = async (email: string, firstName: string, lastName: string) => {
  const sendUpdatePasswordEmailContent = `
    <p>Dear ${firstName} ${lastName},</p>
    <p> This is to inform you that the password for your account has been successfully changed. </p>
    <p> If you recently changed your password, you can disregard this message. However, if you did not authorize this change or if you have any concerns about the security of your account, please contact our support team immediately at [Support Email or Phone Number]. </p>
    <p>Best regards,<br/>[Team Name]</p>`

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: `Password Change Notification`,
    html: sendUpdatePasswordEmailContent,
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return { success: "password update email sent", messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { failure: "Failed to send email", error: error};
  }
}