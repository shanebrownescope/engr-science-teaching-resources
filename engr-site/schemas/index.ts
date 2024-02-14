import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})


export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Minimum 8 character required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
})


