"use server"

import { getCourseById, getCourseByName } from "@/database/data/courses"
import { getModuleById, getModuleByIdAndCourseId } from "@/database/data/modules"
import { getSectionByNameAndModuleId } from "@/database/data/sections"
import dbConnect from "@/database/dbConnector"
import { CreateSectionSchema } from "@/schemas"
import { getCurrentUser } from "@/utils/authHelpers"
import { capitalizeAndReplaceDash, capitalizeWords } from "@/utils/formatting"
import z from "zod"

/**
 * Creates a new section in the database.
 *
 * @param {z.infer<typeof CreateSectionSchema>} values - The values for the new section
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createSection = async (values: z.infer<typeof CreateSectionSchema>) => {
  const user = await getCurrentUser()

  if (user?.role && user.role !== "admin") {
    return { error: "Not authenticated" }
  }
  
  // Attempt to parse and validate the input data against the CreateSectionSchema
  const validatedFields = CreateSectionSchema.safeParse(values);

  // The data is not valid, return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { sectionName, courseId, moduleId  } = validatedFields.data;

  // Check if the course exists in the database
  const existingCourse = await getCourseById(courseId);

  // The course id is not valid, return an error
  if (!existingCourse) {
    return { error: "Course id not found" };
  }

  // Check if course module exists in the database
  const existingModule = await getModuleByIdAndCourseId(moduleId, courseId);

  // The module id is not valid, return an error
  if (!existingModule) {
    return { error: "Module id not found" };
  }


  const formattedSectionName = capitalizeWords(sectionName)
  // Check if the section name already exists for that module
  const existingSection = await getSectionByNameAndModuleId(formattedSectionName, moduleId);

  // The section name is already in use for that module, return an error
  if (existingSection) {
    console.log(existingSection)
    return { error: "Section name already in use for that module" };
  }


  const insertQuery = `INSERT INTO Sections (SectionName, ModuleId) VALUES (?, ?)`;
  const { results } = await dbConnect(insertQuery, [formattedSectionName, moduleId]);

  console.log(results[0].insertId)



  // The section was created successfully, return success message
  return { success: "New section created" }
  
};


export default createSection;