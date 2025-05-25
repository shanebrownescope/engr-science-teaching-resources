"use server";

import * as z from "zod";
import dbConnect from "@/database/dbConnector";
import { ExternalRequestSchema } from "@/schemas"; // 确保从 schemas/index.ts 导入
import { revalidatePath } from "next/cache";

export const submitExternalRequest = async (values: z.infer<typeof ExternalRequestSchema>) => {
  const validatedFields = ExternalRequestSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input!" };
  }

  const { name, email, courseId, description } = validatedFields.data;
  
  console.log("=== submitExternalRequest Debug ===");
  console.log("Submitting request with data:", { name, email, courseId, description });
  
  try {
    const insertQuery = `
      INSERT INTO ExternalRequests_v3 (name, email, courseId, description, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())
    `;

    console.log("Executing query:", insertQuery);
    console.log("With parameters:", [name, email, courseId, description]);

    const dbResult = await dbConnect(insertQuery, [
      name,
      email,
      courseId,
      description
    ]);

    console.log("Database result:", dbResult);

    if (dbResult.error) {
      console.error("Database error: Unable to submit request:", dbResult.error);
      return { error: "Database error: Unable to submit request." };
    }

    // Assuming the dbConnect returns a results structure where the first element contains insertId (e.g., mysql2)
    const insertId = dbResult.results?.[0]?.insertId;
    console.log("Insert ID:", insertId);
    console.log("Full results:", dbResult.results);

    if (insertId) {
      // After successful data insertion, revalidate the pending requests page cache path so administrators can see the latest list
      console.log("Revalidating path: /dashboard/pending-requests");
      await revalidatePath("/dashboard/pending-requests");
      console.log("Request submitted successfully!");
      return { success: "Request submitted successfully. Administrators will review it." };
    } else {
      console.error("Failed to get insertId after request submission:", dbResult.results);
      return { error: "Failed to submit request. Please try again later." };
    }

  } catch (e) {
    console.error("Error occurred while submitting external request:", e);
    return { error: "An unexpected error occurred while submitting the request." };
  }
};