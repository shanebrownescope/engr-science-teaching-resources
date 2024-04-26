"use server"

import { getCourseById, getCourseByName } from "@/database/data/courses"
import dbConnect from "@/database/dbConnector"
import { CreateCourseTopicsSchema } from "@/schemas"
import { getCurrentUser } from "@/utils/authHelpers"
import { capitalizeWords } from "@/utils/formatting"
import z from "zod"

/**
 * Creates a new module in the database.
 *
 * @param {z.infer<typeof AddCourseSchema>} values - The values for the new module
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createCourseTopic = async (values: z.infer<typeof CreateCourseTopicsSchema>) => {
  const user = await getCurrentUser()

  if (user?.role && user.role !== "admin") {
    return { error: "Not authenticated" }
  }

  // Attempt to parse and validate the input data against the CreateCourseTopicSchema
  const validatedFields = CreateCourseTopicsSchema.safeParse(values);

  // The data is not valid, return an error
  if (!validatedFields.success) {
    console.log("--here")
    return { error: "Invalid fields!" };
  }

  const { courseTopicName, courseId  } = validatedFields.data;

  // Check if the course exists in the database
  const existingCourse = await getCourseById(courseId);

  // The course id is not valid, return an error
  if (!existingCourse) {
    return { error: "Course id not found" };
  }

  // TODO: Check if the module name already exists in the database



  const insertQuery = `INSERT INTO CourseTopics_v2 (courseTopicName, courseId) VALUES (?, ?)`;
  const formattedCourseTopicName = capitalizeWords(courseTopicName);
  const { results }  = await dbConnect(insertQuery, [formattedCourseTopicName, courseId]);

  if (!results) {
    return { error: "Error creating course topic" };
  }


  // Proceed with creating the new sections in the database
  if (results[0].insertId) {
    const insertSectionQuery = `INSERT INTO ResourceTypes_v2 (resourceTypeName, courseTopicId) VALUES (?, ?)`;
    const courseTopicId = results[0].insertId
    console.log(courseTopicId)

    // Insert ResourceTypes for Problems
    const problemsSectionName = "Problems";
    await dbConnect(insertSectionQuery, [problemsSectionName, courseTopicId]);

    // Insert ResourceTypes for CourseNotes
    const courseNotesSectionName = "Course Notes";
    await dbConnect(insertSectionQuery, [courseNotesSectionName, courseTopicId]);

    // Insert ResourceTypes for Homework
    const homeworkSectionName = "Homework";
    await dbConnect(insertSectionQuery, [homeworkSectionName, courseTopicId]);

    // Insert ResourceTypes for Exams/Quizzes
    const QuizzesAndExamsNotesSectionName = "Quizzes/Exams";
    await dbConnect(insertSectionQuery, [QuizzesAndExamsNotesSectionName, courseTopicId]);

    //  // Insert ResourceTypes for Exams
    //  const examsNotesSectionName = "Exams";
    //  await dbConnect(insertSectionQuery, [examsNotesSectionName, courseTopicId]);

    //   // Insert Quizzes for Quizzes
    //   const quizzesNotesSectionName = "Quizzes";
    //   await dbConnect(insertSectionQuery, [quizzesNotesSectionName, courseTopicId]);
     
    // Insert ResourceTypes for videos/tutorials
    const videoAndTutorialNotesSectionName = "Videos/Tutorials";
    await dbConnect(insertSectionQuery, [videoAndTutorialNotesSectionName, courseTopicId]);
      
    return { success: "New course topic and sections created" }

  }

  return { success: "New course topic created" }
  
};


export default createCourseTopic;