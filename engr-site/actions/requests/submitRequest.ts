"use server";

import dbConnect from "@/database/dbConnector";
import { z } from "zod";

// Define validation schema for request form
const RequestFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  description: z.string().min(1, "Description cannot be empty"),
  course: z.string().min(1, "Please select a course"),
});

export type RequestFormData = z.infer<typeof RequestFormSchema>;

/**
 * Submit external teacher request to database
 * @param values - Request form data
 * @returns Object containing operation status
 */
export const submitRequest = async (values: RequestFormData) => {
  try {
    console.log("Starting request submission process");
    
    // Validate form data
    const validatedFields = RequestFormSchema.safeParse(values);
  
    console.log("Validation result:", validatedFields.success);
    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }
  
    const { name, email, description, course } = validatedFields.data;
    console.log("Validated data:", { name, email, description, course });

    // 检查数据库连接
    try {
      const testQuery = "SELECT 1 as test";
      const testResult = await dbConnect(testQuery);
      console.log("Database connection test:", testResult);
    } catch (dbError) {
      console.error("Database connection test failed:", dbError);
    }

    // Insert request into database
    const insertQuery = `
      INSERT INTO ExternalRequests_v2 (name, email, description, courseId, requestDate, status) 
      VALUES (?, ?, ?, ?, NOW(), 'pending')`;
    
    console.log("Executing query:", insertQuery);
    console.log("With values:", [name, email, description, course]);
    
    const { results, error } = await dbConnect(insertQuery, [
      name,
      email,
      description,
      course,
    ]);

    console.log("Query results:", results);
    
    if (error) {
      console.error("Error inserting request:", error);
      // 检查是否是表不存在的错误
      if (error.toString().includes("doesn't exist")) {
        return { failure: "Database table does not exist", error: error };
      }
      return { failure: "Failed to submit request", error: error };
    }

    return { success: "Your request has been submitted successfully. We will contact you soon." };
  } catch (error) {
    console.error("Error submitting request:", error);
    return { failure: "An error occurred while submitting your request. Please try again later.", error: error };
  }
};