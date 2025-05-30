import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8, {
    message: "Minimum 8 character required",
  }),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .trim(),
});

export const RegisterFormEmailSchema = z.object({
  email: z.string().email().trim(),
  firstName: z
    .string()
    .min(1, {
      message: "First name is required",
    })
    .max(100, { message: "First name must not exceed 100 characters" }),
  lastName: z
    .string()
    .min(1, {
      message: "Last name is required",
    })
    .max(100, { message: "Last name must not exceed 100 characters" }),
  username: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .max(50, { message: "Username must not exceed 50 characters" }),
  password: z.string().min(8, {
    message: "Minimum 8 character required",
  }),
});

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .trim(),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Minimum 8 character required" }), // Adjust the minimum password length as needed
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UploadFileAndTagsSchema = z.object({
  name: z.string().trim(),
  // file: z.instanceof(File),
  tags: z.array(z.string().trim()),
  course: z.string(),
  module: z.string(),
  section: z.string(),
});

export const CreateCourseSchema = z.object({
  courseName: z
    .string()
    .trim()
    .min(2, { message: "Course name must contain at least 2 characters" })
    .max(100, { message: "Course name must not exceed 100 characters" }),
});

export const CreateCourseTopicsSchema = z.object({
  courseTopicName: z
    .string()
    .trim()
    .min(2, { message: "Module name must contain at least 2 characters" })
    .max(100, { message: "Module name must not exceed 100 characters" }),
  courseId: z.string().min(1, { message: "Course is required" }),
});

export const CreateResourceTypeSchema = z.object({
  resourceTypeName: z
    .string()
    .trim()
    .min(2, { message: "Section name must contain at least 2 characters" })
    .max(100, { message: "Section name must not exceed 100 characters" }),
  courseId: z.string().min(1, { message: "Course is required" }),
  courseTopicId: z.string().min(1, { message: "Course topic is required" }),
});

export const CreateConceptSchema = z.object({
  conceptName: z
    .string()
    .trim()
    .min(2, { message: "Concept name must contain at least 2 characters" })
    .max(100, { message: "Concept name must not exceed 100 characters" }),
  courseId: z.string().min(1, { message: "Course is required" }),
  courseTopicId: z.string().min(1, { message: "Course topic is required" }),
  resourceTypeId: z.string().min(1, { message: "Resource type is required" }),
});

export const UploadFileSchema = z.object({
  fileUrl: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  checksum: z.string(),
  description: z.string(),
  contributor: z.string(),
  uploadDate: z.string().datetime(),
  tags: z.array(z.string().trim()),

  courseId: z.string(),
  courseName: z.string(),
  moduleId: z.string(),
  moduleName: z.string(),
  sectionId: z.string(),
  sectionName: z.string(),
  conceptId: z.string(),
  conceptName: z.string(),
});

export const CommentSchema = z.object({
  commentText: z.string().min(1, {
    message: "Comment is required",
  }),
});

export const ReviewSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required"
  }).trim(),
  userPublicName: z.string().min(1, {
    message: "User public name is required"
  }).trim(),
  comments: z.string().trim(),
  rating: z.number()
    .min(0, {
      message: "Rating must be at least 0"
    })
    .max(5, {
      message: "Rating cannot exceed 5"
    })
    .refine(val => {
      // Convert to string and check decimal places
      const decimalPart = val.toString().split('.')[1];
      return !decimalPart || decimalPart.length <= 2;
    }, {
      message: "Rating can have at most 2 decimal places"
    })
})

export const ExternalRequestSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  courseId: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? parseInt(val, 10) : val),
    z.number({ required_error: "Please select a course", invalid_type_error: "Course ID must be a number" }).int().positive({ message: "Please select a valid course" })
  ),
  description: z.string().min(1, { message: "Description cannot be empty" }),
});