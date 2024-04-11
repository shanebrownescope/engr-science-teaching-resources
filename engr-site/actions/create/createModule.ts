"use server"

import { getCourseById, getCourseByName } from "@/database/data/courses"
import dbConnect from "@/database/dbConnector"
import { CreateModuleSchema } from "@/schemas"
import { getCurrentUser } from "@/utils/authHelpers"
import { capitalizeWords } from "@/utils/formatting"
import z from "zod"

/**
 * Creates a new module in the database.
 *
 * @param {z.infer<typeof AddCourseSchema>} values - The values for the new module
 * @returns {{ error?: string, success?: string }} - The response from the database
 */
const createModule = async (values: z.infer<typeof CreateModuleSchema>) => {
  const user = await getCurrentUser()

  if (user?.role && user.role !== "admin") {
    return { error: "Not authenticated" }
  }

  // Attempt to parse and validate the input data against the CreateModuleSchema
  const validatedFields = CreateModuleSchema.safeParse(values);

  // The data is not valid, return an error
  if (!validatedFields.success) {
    console.log("--here")
    return { error: "Invalid fields!" };
  }

  const { moduleName, courseId  } = validatedFields.data;

  // Check if the course exists in the database
  const existingCourse = await getCourseById(courseId);

  // The course id is not valid, return an error
  if (!existingCourse) {
    return { error: "Course id not found" };
  }

  // TODO: Check if the module name already exists in the database



  const insertQuery = `INSERT INTO Modules (ModuleName, CourseId) VALUES (?, ?)`;
  const formattedModuleName = capitalizeWords(moduleName);
  const { results }  = await dbConnect(insertQuery, [formattedModuleName, courseId]);

  if (!results) {
    return { error: "Error creating module" };
  }


  // Proceed with creating the new sections in the database
  if (results[0].insertId) {
    const insertSectionQuery = `INSERT INTO Sections (SectionName, ModuleId) VALUES (?, ?)`;
    const moduleId = results[0].insertId
    console.log(moduleId)

    // Insert Section for Problems
    const problemsSectionName = "Problems";
    await dbConnect(insertSectionQuery, [problemsSectionName, moduleId]);

    // Insert Section for CourseNotes
    const courseNotesSectionName = "Course Notes";
    await dbConnect(insertSectionQuery, [courseNotesSectionName, moduleId]);

    return { success: "New module and sections created" }

  }

  // The module was created successfully, return success message
  return { success: "New module created" }
  
};


export default createModule;