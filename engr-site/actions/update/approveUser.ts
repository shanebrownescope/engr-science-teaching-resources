"use server"

import dbConnect from "@/database/dbConnector"
import { revalidatePath } from "next/cache"
import { transporter } from "@/utils/email"
import { sendUserUpdateEmailProps } from "@/app/(protected)/dashboard/pending-users/page"

export const approveUser = async (userId: string) => {
  try {
    const updateQuery = `
      UPDATE Users SET AccountStatus = 'approved' WHERE UserId = ${userId}`;
    //       UPDATE Users SET AccountStatus = 'pending' WHERE UserId = 55;

    const { results: updatedUser } = await dbConnect(
      updateQuery
    )

    await revalidatePath('/pending-users')

    return { success: "User approved" }
  } catch (error) {
    console.error('Error approving user:', error)
    throw error
  }
}


// Function to send email to user notifying about approval
export const sendUserApprovalEmail = async ( {email, firstName, lastName}: sendUserUpdateEmailProps ) => {
  try {

    const userApprovalEmailContent = `
      <p>Dear ${firstName} ${lastName},</p>
      <p> We're excited to inform you that your account on [Website Name] has been approved! </p>
      <p> You can now login and start enjoying all the features and services our platform has to offer. </p>
      <p>Best regards,<br/>[Team Name]</p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `Your Account Has Been Approved`,
      html: userApprovalEmailContent,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return { success: "Approval email sent", messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { failure: "Failed to send email" ,error: error };
  }
}

