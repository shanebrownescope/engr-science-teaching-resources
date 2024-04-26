"use server";

import { getConceptByNameAndResourceTypeId } from "@/database/data/concepts";
import { getCourseTopicByIdAndCourseId } from "@/database/data/courseTopics";
import { getCourseById } from "@/database/data/courses";
import { getResourceTypeByIdAndCourseTopicId } from "@/database/data/resourceTypes";
import dbConnect from "@/database/dbConnector";
import { CreateConceptSchema } from "@/schemas";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeWords } from "@/utils/formatting";
import z from "zod";

/**
 * Creates a new concept in the database.
 *
 * @param {z.infer<typeof CreateConceptSchema>} values - The values for the new concept
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createConcept = async (values: z.infer<typeof CreateConceptSchema>) => {
  const user = await getCurrentUser();

  if (user?.role && user.role !== "admin") {
    return { error: "Not authenticated" };
  }

  // Attempt to parse and validate the input data against the CreateConceptSchema
  const validatedFields = CreateConceptSchema.safeParse(values);

  // The data is not valid, return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { conceptName, courseId, courseTopicId, resourceTypeId } = validatedFields.data;

  // Check if the course exists in the database
  const existingCourse = await getCourseById(courseId);

  // The course id is not valid, return an error
  if (!existingCourse) {
    return { error: "Course id not found" };
  }

  // Check if the course topic exists in the database
  const existingCourseTopic = await getCourseTopicByIdAndCourseId(courseTopicId, courseId);

  // The courseTopic id is not valid, return an error
  if (!existingCourseTopic) {
    return { error: "courseTopic id not found" };
  }

  // Check if the courseTopic resourceType exists in the database
  const existingResourceType = await getResourceTypeByIdAndCourseTopicId(resourceTypeId, courseTopicId);

  // The resourceType id is not valid, return an error
  if (!existingResourceType) {
    return { error: "ResourceType id not found" };
  }

  const formattedConceptName = capitalizeWords(conceptName);

  const existingConcept = await getConceptByNameAndResourceTypeId(
    formattedConceptName, 
    resourceTypeId
  )

  if (existingConcept) {
    return { error: "Concept already exists" };
  }

  const insertQuery = `INSERT INTO Concepts_v2 (conceptName, resourceTypeId) VALUES (?, ?)`;
  const { results } = await dbConnect(insertQuery, [
    formattedConceptName,
    resourceTypeId,
  ]);

  console.log(results[0].insertId);

  // The concept was created successfully, return success message
  return { success: "New concept created" };
};

export default createConcept;
