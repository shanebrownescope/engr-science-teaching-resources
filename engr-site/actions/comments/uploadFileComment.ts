"use server"

import dbConnect from "@/database/dbConnector";
import { CommentSchema } from "@/schemas";
import z from "zod"

export const uploadFileComment =  async(values: z.infer<typeof CommentSchema>, userId: string, fileId: string) => {
  const validatedFields = CommentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { failure: "Invalid comment!" };
  }

  const { commentText } = validatedFields.data;

  const uploadQuery = `
    INSERT INTO CommentFiles (FileId, UserId, CommentText) VALUES (?, ?, ?)
  `;

  const { results, error } = await dbConnect(uploadQuery, [fileId, userId, commentText]);
}