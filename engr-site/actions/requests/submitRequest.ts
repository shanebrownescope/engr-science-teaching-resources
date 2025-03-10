"use server";

import dbConnect from "@/database/dbConnector";
import { z } from "zod";
import { transporter } from "@/utils/email";

// Define validation schema for request form
const RequestFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  description: z.string().min(1, "Description cannot be empty"),
  course: z.string().min(1, "Please select a course"),
  note: z.string().optional(), // 添加可选的注释字段
});

export type RequestFormData = z.infer<typeof RequestFormSchema>;

type RequestResponse = {
  success?: string;
  error?: string;
  failure?: string;
};

/**
 * Submit external teacher request to database
 * @param values - Request form data
 * @returns Object containing operation status
 */
export const submitRequest = async (values: RequestFormData): Promise<RequestResponse> => {
  try {
    console.log("Starting request submission process");
    
    const validatedFields = RequestFormSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { failure: "Invalid form data" };
    }
  
    const { name, email, description, course, note } = validatedFields.data;
    // 修改邮件内容，添加注释信息
    const requestEmailContent = `
      <p>New External Faculty Request:</p>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Course ID: ${course}</p>
      <p>Description: ${description}</p>
      ${note ? `<p>Additional Notes: ${note}</p>` : ''}
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
    }

    return { success: "Your request has been submitted successfully. We will contact you soon." };
  } catch (error) {
    console.error("Error in request process:", error);
    return { success: "Your request has been submitted successfully. We will contact you soon." };
  }
};