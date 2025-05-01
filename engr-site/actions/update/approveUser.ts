"use server";

import dbConnect from "@/database/dbConnector";
import { revalidatePath } from "next/cache";
import { transporter } from "@/utils/email";
import { sendUserUpdateEmailProps } from "@/app/(protected)/dashboard/pending-users/page";

/**
 * Updates the account status of a user to 'approved'
 * @param {string} userId - The ID of the user to be approved
 * @returns {Promise<{success: string}>} - A promise that resolves to an object with the status of the operation
 * @throws {Error} - If there is an error approving the user
 */
export const approveUser = async (userId: string) => {
  try {
    const updateQuery = `
      UPDATE Users_v3 SET accountStatus = 'approved' WHERE id = ${userId}`;

    const { results: updatedUser } = await dbConnect(updateQuery);

    await revalidatePath("/dashboard/pending-users");

    return { success: "User approved" };
  } catch (error) {
    throw error;
  }
};

// Function to send email to user notifying about approval
export const sendUserApprovalEmail = async ({
  email,
  firstName,
  lastName,
}: sendUserUpdateEmailProps) => {
  try {
    const userApprovalEmailContent = `
      <p>Dear ${firstName} ${lastName},</p>
      <p> We're excited to inform you that your account on [Website Name] has been approved! </p>
      <p> You can now login and start enjoying all the features and services our platform has to offer. </p>
      <p>Best regards,<br/> ${process.env.TEAM_NAME} </p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `Your Account Has Been Approved`,
      html: userApprovalEmailContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: "Approval email sent", messageId: info.messageId };
  } catch (error) {
    return { failure: "Failed to send email", error: error };
  }
};
