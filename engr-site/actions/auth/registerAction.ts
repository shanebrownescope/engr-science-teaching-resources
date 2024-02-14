"use server"

import dbConnect from "@/database/dbConnector"
import bcrypt from "bcryptjs"
import { RegisterSchema } from "@/schemas"
import * as z from "zod"
import { getUserByEmail } from "@/database/data/user"

export const registerAction = async (values: z.infer<typeof RegisterSchema>) => {
  //* attempts to parse and validate the input data against the RegisterSchema
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const exisitingUser = await getUserByEmail(email)
  
  //* User exists
  if (exisitingUser) {
    return { error: "Email already in use"}
  } 

  const insertQuery = `
    INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)`
  
  const { results: insertedUser } = await dbConnect(insertQuery, [name, email, hashedPassword, 'admin'])
  console.log("insertedUser: ", insertedUser)

  // TODO: Send verification token email

  return { success: "New user created"}
}