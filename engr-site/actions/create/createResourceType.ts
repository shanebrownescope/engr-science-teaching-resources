"use server";

import { getCourseTopicByIdAndCourseId } from "@/database/data/courseTopics";
import { getCourseById } from "@/database/data/courses";
import { getResourceTypeByNameAndCourseTopicId } from "@/database/data/resourceTypes";
import dbConnect from "@/database/dbConnector";
import { CreateResourceTypeSchema } from "@/schemas";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeWords } from "@/utils/formatting";
import z from "zod";

const createResourceType = async (values: z.infer<typeof CreateResourceTypeSchema>) => {
  const user = await getCurrentUser();

  if (user?.role && user.role !== "admin") {
    return { error: "Not authenticated" };
  }

  // Attempt to parse and validate the input data against the CreateSectionSchema
  const validatedFields = CreateResourceTypeSchema.safeParse(values);

  // The data is not valid, return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { resourceTypeName, courseId, courseTopicId } = validatedFields.data;

  // Check if the course exists in the database
  const existingCourse = await getCourseById(courseId);

  // The course id is not valid, return an error
  if (!existingCourse) {
    return { error: "Course id not found" };
  }

  // Check if course topic exists in the database
  const existingCourseTopic = await getCourseTopicByIdAndCourseId(courseTopicId, courseId);

  // The module id is not valid, return an error
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
};

export default createResourceType;
