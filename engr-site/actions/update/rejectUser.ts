"use server"

import { sendUserUpdateEmailProps } from "@/app/(protected)/dashboard/pending-users/page";
import dbConnect from "@/database/dbConnector"
import { transporter } from "@/utils/email";
import { revalidatePath } from "next/cache"

export const rejectUser = async (userId: string) => {
  try {
    const updateQuery = `
      UPDATE Users_v2 SET accountStatus = 'rejected' WHERE id = ${userId}`;
    //       UPDATE Users SET AccountStatus = 'pending' WHERE UserId = 55;


    const { results: updatedUser } = await dbConnect(
      updateQuery
    )

    await revalidatePath('/dashboard/pending-users')

    return { success: "User approved" }
  } catch (error) {
    console.error('Error approving user:', error)
    throw error
  }
}

export const sendUserRejectionEmail = async ({ email, firstName, lastName }: sendUserUpdateEmailProps) => {
  try {

    const userRejectionEmailContent= `
      <p>Dear ${firstName} ${lastName},</p>
      <p> We regret to inform you that your recent registration request on [Website Name] has been rejected. </p>
      <p> Unfortunately, your application did not meet our eligibility criteria at this time, and we are unable to approve your account.  </p>
      <p>Best regards,<br/>[Team Name]</p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `Your Account Has Been Rejected`,
      html: userRejectionEmailContent,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return { success: "Rejection email sent", messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { failure: "Failed to send email" ,error: error };
  }
}

