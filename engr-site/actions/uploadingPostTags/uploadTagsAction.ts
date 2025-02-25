"use server";

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";

const getTagId = async (tagName: string) => {
  console.log("Processing tag:", tagName);

  try {
    // First check if tag exists
    const checkQuery = `SELECT id FROM Tags_v3 WHERE tagName = ?`;
    const { results: existingTags, error: selectError } = await dbConnect(checkQuery, [tagName]);

    if (selectError) {
      console.error("Error checking existing tag:", selectError);
      return { failure: "Error checking existing tag" };
    }

    // Check if we got any results
    if (existingTags[0] && existingTags[0].length > 0) {
      console.log("Found existing tag:", existingTags[0][0]);
      return { tagId: existingTags[0][0].id };
    }

    // If we get here, tag doesn't exist, so create it
    const insertQuery = `INSERT INTO Tags_v3 (tagName) VALUES (?)`;
    const { results: insertResult, error: insertError } = await dbConnect(insertQuery, [tagName]);

    if (insertError) {
      console.error("Error creating new tag:", insertError);
      return { failure: "Error creating new tag" };
    }

    if (!insertResult[0] || !insertResult[0].insertId) {
      console.error("Insert succeeded but no ID returned");
      return { failure: "Failed to get new tag ID" };
    }

    console.log("Created new tag with ID:", insertResult[0].insertId);
    return { tagId: insertResult[0].insertId };

  } catch (error) {
    console.error("Unexpected error in getTagId:", error);
    return { failure: "Unexpected error processing tag" };
  }
};

export const createTagPostFile = async (tags: string[], fileId: number) => {
  console.log("Processing tags:", tags);

  const user = await getCurrentUser();
  if (!user?.id || user?.role !== "admin") {
    return { failure: "Not authenticated" };
  }

  try {
    const processedTags = [];

    // Use Promise.all to process tags in parallel
    const tagResponses = await Promise.all(
      tags.map(async (tagName) => {
        if (!tagName.trim()) return null;

        const tagResponse = await getTagId(tagName.trim());
        if (tagResponse.failure) {
          console.error(`Failed to process tag "${tagName}":`, tagResponse.failure);
          return null;
        }
        
        return { name: tagName, id: tagResponse.tagId };
      })
    );

    // Remove null values (failed inserts)
    const validTags = tagResponses.filter(Boolean);

    if (validTags.length === 0) {
      return { failure: "No valid tags were processed." };
    }

    console.log("Successfully processed tags:", validTags);
    return {
      success: true,
      tags: validTags,
      message: `Successfully processed tags: ${validTags.map(t =>  t.name).join(', ')}`,
    };
  } catch (error) {
    console.error("Error processing tags:", error);
    return { failure: "Internal server error while processing tags" };
  }
};