"use server"

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"



export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values)
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
        // case "AccountPending":
        //   return { error: 'Your account is pending approval. Please wait for approval.' };
        // case "AccountRejected":
        //   return { error: 'Your account has been rejected. Please contact support for assistance.' };
        default: 
          return { error: "Something went wrong!" }
      }
    }
    //* has to throw error or won't redirect
    throw error;
  }
}