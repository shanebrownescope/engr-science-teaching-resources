"use server"

import { getCourseById } from "@/database/data/courses"
import { getModuleByIdAndCourseId } from "@/database/data/modules"
import {  getSectionByIdAndModuleId } from "@/database/data/sections"
import dbConnect from "@/database/dbConnector"
import { CreateConceptSchema } from "@/schemas"
import { capitalizeWords } from "@/utils/formatting"
import z from "zod"

/**
 * Creates a new concept in the database.
 *
 * @param {z.infer<typeof CreateConceptSchema>} values - The values for the new concept
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createConcept = async (values: z.infer<typeof CreateConceptSchema>) => {
  // Attempt to parse and validate the input data against the CreateConceptSchema
  const validatedFields = CreateConceptSchema.safeParse(values);

  // The data is not valid, return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { conceptName, courseId, moduleId, sectionId  } = validatedFields.data;

  // Check if the course exists in the database
  const existingCourse = await getCourseById(courseId);

  // The course id is not valid, return an error
  if (!existingCourse) {
    return { error: "Course id not found" };
  }

  // Check if the course module exists in the database
  const existingModule = await getModuleByIdAndCourseId(moduleId, courseId);

  // The module id is not valid, return an error
  if (!existingModule) {
    return { error: "Module id not found" };
  }

  // Check if the module section exists in the database
  const existingSection = await getSectionByIdAndModuleId(sectionId, moduleId);

  // The section id is not valid, return an error
  if (!existingSection) {
    return { error: "Section id not found" };
  }


  const formattedConceptName = capitalizeWords(conceptName)
  // ? Check if we want to check if concept name exists under that section
  // Check if the section name already exists for that module
  // const existingConcept = await getSectionByNameAndId(formattedConceptName, moduleId);

  // // The section name is already in use for that module, return an error
  // if (existingSection) {
  //   console.log(existingSection)
  //   return { error: "Section name already in use for that module" };
  // }


  const insertQuery = `INSERT INTO Concepts (ConceptName, SectionId) VALUES (?, ?)`;
  const { results } = await dbConnect(insertQuery, [formattedConceptName, sectionId]);

  console.log(results[0].insertId)



  // The concept was created successfully, return success message
  return { success: "New concept created" }
  
};


export default createConcept;