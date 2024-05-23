"use server";

import { sendUserUpdateEmailProps } from "@/app/(protected)/dashboard/pending-users/page";
import dbConnect from "@/database/dbConnector";
import { transporter } from "@/utils/email";
import { revalidatePath } from "next/cache";

/**
 * Updates the account status of a user to 'rejected'
 * @param {string} userId - The ID of the user to be rejected
 * @returns {Promise<{success: string}>} - A promise that resolves to an object with the status of the operation
 * @throws {Error} - If there is an error rejecting the user
 */
export const rejectUser = async (userId: string) => {
  try {
    const updateQuery = `
      UPDATE Users_v2 SET accountStatus = 'rejected' WHERE id = ${userId}`;

    const { results: updatedUser } = await dbConnect(updateQuery);

    await revalidatePath("/dashboard/pending-users");

    return { success: "User rejected" };
  } catch (error) {
    throw error;
  }
};

/**
 * Sends an email to a user notifying them that their account has been rejected.
 *
 * @param {Object} user - An object containing the user's email, first name, and last name
 * @param {string} user.email - The user's email address
 * @param {string} user.firstName - The user's first name
 * @param {string} user.lastName - The user's last name
 * @returns {Promise<{success: string, messageId: string} | {failure: string, error: Error}>} - A promise that resolves to an object with the status of the operation and the message ID if successful
 */
export const sendUserRejectionEmail = async ({
  email,
  firstName,
  lastName,
}: sendUserUpdateEmailProps) => {
  try {
    const userRejectionEmailContent = `
      <p>Dear ${firstName} ${lastName},</p>
      <p> We regret to inform you that your recent registration request on [Website Name] has been rejected. </p>
      <p> Unfortunately, your application did not meet our eligibility criteria at this time, and we are unable to approve your account.  </p>
      <p>Best regards,<br/> ${process.env.TEAM_NAME} </p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `Your Account Has Been Rejected`,
      html: userRejectionEmailContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: "Rejection email sent", messageId: info.messageId };
  } catch (error) {
    return { failure: "Failed to send email", error: error };
  }
};
