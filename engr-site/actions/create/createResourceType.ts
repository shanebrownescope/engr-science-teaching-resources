"use server";

import { getCourseTopicByIdAndCourseId } from "@/database/data/courseTopics";
import { getCourseById } from "@/database/data/courses";
import { getResourceTypeByNameAndCourseTopicId } from "@/database/data/resourceTypes";
import dbConnect from "@/database/dbConnector";
import { CreateResourceTypeSchema } from "@/schemas";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeWords } from "@/utils/formatting";
import z from "zod";

/**
 * Creates a new resource type in the database.
 *
 * @param {z.infer<typeof CreateResourceTypeSchema>} values - The values for the new resource type
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createResourceType = async (values: z.infer<typeof CreateResourceTypeSchema>) => {
  try {
    const user = await getCurrentUser();

    if (user?.role && user.role !== "admin") {
      return { error: "Not authenticated" };
    }

    const validatedFields = CreateResourceTypeSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { resourceTypeName, courseId, courseTopicId } = validatedFields.data;

    const existingCourse = await getCourseById(courseId);

    if (!existingCourse) {
      return { error: "Course id not found" };
    }

    const existingCourseTopic = await getCourseTopicByIdAndCourseId(courseTopicId, courseId);

    if (!existingCourseTopic) {
      return { error: "Course topic id not found" };
    }

    const formattedResourceTypeName = capitalizeWords(resourceTypeName);

    const existingResourceType = await getResourceTypeByNameAndCourseTopicId(
      formattedResourceTypeName,
      courseTopicId
    );

    if (existingResourceType) {
      console.log(existingResourceType);
      return { error: "Resource type name already in use for that course topic" };
    }

    const insertQuery = `INSERT INTO ResourceTypes_v2 (resourceTypeName, courseTopicId) VALUES (?, ?)`;
    const { results } = await dbConnect(insertQuery, [
      formattedResourceTypeName,
      courseTopicId,
    ]);

    console.log(results[0].insertId);

    return { success: "New resource type created" };
  } catch (error) {
    return { error: "Error" };
  }
};

export default createResourceType;
