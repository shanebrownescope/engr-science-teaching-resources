import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim()
})


export const RegisterSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8, {
    message: "Minimum 8 character required",
  }),
  name: z.string().min(1, {
    message: "Name is required"
  }).trim()
})


export const UploadFileAndTagsSchema = z.object({
  name: z.string().trim(),
  file: z.instanceof(File),
  tags: z.array(z.string().trim()),
  course: z.string(),
  module: z.string(),
  section: z.string()
})

export const CreateCourseSchema = z.object({
  courseName: z.string().trim().min(2, { message: "Course name must contain at least 2 characters"}).max(100, { message: "Course name must not exceed 100 characters"}),
})

export const CreateModuleSchema = z.object({
  moduleName: z.string().trim().min(2, { message: "Module name must contain at least 2 characters"}).max(100, { message: "Module name must not exceed 100 characters"}),
  courseId: z.string().min(1, { message: 'Course is required' })
})

export const CreateSectionSchema = z.object({
  sectionName: z.string().trim().min(2, { message: "Section name must contain at least 2 characters"}).max(100, { message: "Section name must not exceed 100 characters"}),
  courseId: z.string().min(1, { message: 'Course is required' }),
  moduleId: z.string().min(1, { message: 'Module is required' })
})


export const CreateConceptSchema = z.object({
  conceptName: z.string().trim().min(2, { message: "Concept name must contain at least 2 characters"}).max(100 , { message: "Concept name must not exceed 100 characters"}),
  courseId: z.string().min(1, { message: 'Course is required' }),
  moduleId: z.string().min(1, { message: 'Module is required' }),
  sectionId: z.string().min(1, { message: 'Section is required' })
})