"use server";

import { getCourseById, getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { CreateCourseTopicsSchema } from "@/schemas";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeWords } from "@/utils/formatting";
import z from "zod";

/**
 * Creates a new course topic in the database with corresponding sections.
 *
 * @param {z.infer<typeof CreateCourseTopicsSchema>} values - The values for the new course topic
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createCourseTopic = async (
  values: z.infer<typeof CreateCourseTopicsSchema>,
) => {
  try {
    const user = await getCurrentUser();
    if (user?.role && user.role !== "admin") {
      return { error: "Not authenticated" };
    }

    const validatedFields = CreateCourseTopicsSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { courseTopicName, courseId } = validatedFields.data;

    const existingCourse = await getCourseById(courseId);
    if (!existingCourse) {
      return { error: "Course id not found" };
    }

    const insertQuery = `INSERT INTO CourseTopics_v3 (courseTopicName, courseId) VALUES (?, ?)`;
    const formattedCourseTopicName = capitalizeWords(courseTopicName);
    const { results } = await dbConnect(insertQuery, [
      formattedCourseTopicName,
      courseId,
    ]);

    if (!results) {
      return { error: "Error creating course topic" };
    }

    // if (results[0].insertId) {
    //   const courseTopicId = results[0].insertId;

    //   const insertSectionQuery = `INSERT INTO ResourceTypes_v2 (resourceTypeName, courseTopicId) VALUES (?, ?)`;

    //   const problemsSectionName = "Problems";
    //   await dbConnect(insertSectionQuery, [problemsSectionName, courseTopicId]);

    //   const courseNotesSectionName = "Course Notes";
    //   await dbConnect(insertSectionQuery, [
    //     courseNotesSectionName,
    //     courseTopicId,
    //   ]);

    //   const homeworkSectionName = "Homework";
    //   await dbConnect(insertSectionQuery, [homeworkSectionName, courseTopicId]);

    //   const quizzesAndExamsSectionName = "Quizzes/Exams";
    //   await dbConnect(insertSectionQuery, [
    //     quizzesAndExamsSectionName,
    //     courseTopicId,
    //   ]);

    //   const videoAndTutorialSectionName = "Videos/Tutorials";
    //   await dbConnect(insertSectionQuery, [
    //     videoAndTutorialSectionName,
    //     courseTopicId,
    //   ]);

    //   return { success: "New course topic and sections created" };
    // }

    return { success: "New course topic created" };
  } catch (error) {
    return { error: "Error creating course topic" };
  }
};

export default createCourseTopic;
