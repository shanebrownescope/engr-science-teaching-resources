"use server"


import * as crypto from 'crypto';
import * as z from "zod";
import { ForgetPasswordSchema } from "@/schemas"
import dbConnect from "@/database/dbConnector"
import { getUserByEmail } from "@/database/data/user"
import { transformObjectKeys } from "@/utils/helpers";
import { FetchedUserData, UserData } from "@/utils/types";
import { transporter } from '@/utils/email';



export const sendResetPassword = async(values: z.infer<typeof ForgetPasswordSchema>) => {

  const validatedFields = ForgetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { failure: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser: UserData = await getUserByEmail(email)

  if (!existingUser) {
    return { failure: "Email not found!" };
  }

  const resetToken = await generateResetToken(existingUser)

  if (!resetToken) {
    return { failure: "Failed to generate reset token!" };
  }

  console.log("-- resetToken: ", resetToken)

  const sendEmailResult = await sendPasswordResetEmail({ user: existingUser, resetToken })
  
  if (sendEmailResult.failure) {
    return { failure: "Failed to send password reset email: " + sendEmailResult.failure }
  }

  return { success: "Password reset email sent!" };
}

const generateResetToken = async (user: UserData) => {
  // Generate a secure, unique token
  let resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  console.log("expires: ", expires);

  // Check if the generated token already exists in the database
  const existingTokenQuery = `
    SELECT 1
    FROM PasswordResetTokens_v2
    WHERE token = ?`;


  const { results : existingTokenResult } = await dbConnect(existingTokenQuery, [resetToken]);

  let existingTokenCount = existingTokenResult[0].length
  console.log("-- existingTokenCount: ", existingTokenCount);

  // If a token with the same value already exists, regenerate the token
  while (existingTokenCount > 0) {
    resetToken = crypto.randomBytes(32).toString('hex');
    const { result: existingTokenResult2} = await dbConnect(existingTokenQuery, [resetToken]);
    existingTokenCount = existingTokenResult2[0].length
    console.log("-- existingTokenCount again: ", existingTokenCount);
  }

  // Store the token and expiration time in the PasswordResetToken table
  const insertQuery = `
    INSERT INTO PasswordResetTokens_v2
    (userId, token, expiresAt) 
    VALUES (?, ?, ?)`;

  const { results, error } = await dbConnect(insertQuery, [user.id, resetToken, expires]); 

  if (error) {
    return null;
  }

  return resetToken;
};




const sendPasswordResetEmail = async ({ user, resetToken }: { user: UserData, resetToken: string })  => {
  // const resetLink = `${process.env.SITE_URL}/auth/new-password/${resetToken}`
  const resetLink = `${process.env.SITE_URL}/auth/reset-password?token=${resetToken}`
  try {
    const sendPasswordResetEmailContent = `
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p> You are receiving this email because a password reset request was initiated for your account. If you did not request a password reset, please ignore this email. </p>
      <p> To reset your password, please click on the following link: </p>
      <p> <a href="${resetLink}"> ${resetLink} </a> </p>
      <p> If you are unable to click the link, please copy and paste it into your browser's address bar. </p>
      <p>Best regards,<br/>[Team Name]</p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: `Password Reset Request`,
      html: sendPasswordResetEmailContent,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return { success: "password reset email sent", messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { failure: "Failed to send email" ,error: error };
  }
}


