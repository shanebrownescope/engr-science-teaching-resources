"use server"

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"


/**
 * Server action to handle user login.
 * 
 * Attempts to sign in the user using the `signIn` function from the `@/auth` module.
*
 * @param {z.infer<typeof LoginSchema>} values - The input values for the login action.
 * @returns {Promise<{ success?: string, error?: string }>} - The result of the login action.
 * 
*/

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  //* attempts to parse and validate the input data against the LoginSchema
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    return { success: "User logged in!"}
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default: 
          return { error: "Something went wrong!" }
      }
    }
    //* has to throw error or won't redirect
    throw error;
  }
}
