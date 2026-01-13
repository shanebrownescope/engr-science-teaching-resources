"use server";

import * as z from "zod";
import dbConnect from "@/database/dbConnector";
import { ExternalRequestSchema } from "@/schemas"; 
import { revalidatePath } from "next/cache";
import { transporter } from "@/utils/email";

type RequestFormData = z.infer<typeof ExternalRequestSchema>;

type RequestResponse = {
  success?: string;
  error?: string;
};

/**
 * Submit external teacher request to database
 * @param values - Request form data
 * @returns Object containing operation status
 */
export const submitExternalRequest = async (values: RequestFormData): Promise<RequestResponse> => {
  const validatedFields = ExternalRequestSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input!" };
  }

  const { name, email, courseId, description } = validatedFields.data;
  
  try {
    const insertQuery = `
      INSERT INTO ExternalRequests_v3 (name, email, courseId, description, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())
    `;

    const { results, error } = await dbConnect(insertQuery, [
      name,
      email,
      courseId,
      description
    ]);

    if (error) {
      console.error("Database error: Unable to submit request:", error);
      return { error: "Database error: Unable to submit request." };
    }

    const insertId = results[0].insertId;

    if (insertId) {
      
      // Send email to admin
      const requestEmailContent = `
        <p>New External Faculty Request:</p>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Course ID: ${courseId}</p>
        <p>Description: ${description}</p>
      `;

      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_EMAIL,
        subject: `New External Faculty Resource Request`,
        html: requestEmailContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent to admin");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue even if email fails, since we've saved to the database
      }

      // After successful data insertion, revalidate the pending requests page cache path so administrators can see the latest list
      console.log("Revalidating path: /dashboard/pending-requests");
      await revalidatePath("/dashboard/pending-requests");
      console.log("Request submitted successfully!");
      return { success: "Request submitted successfully. Administrators will review it." };

    } else {
      console.error("Failed to get insertId after request submission:", results);
      return { error: "Failed to submit request. Please try again later." };
    }

  } catch (e) {
    console.error("Error occurred while submitting external request:", e);
    return { error: "An unexpected error occurred while submitting the request." };
  }
};
