export const runtime = 'nodejs';
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas"; //* need LoginSchem just in case user tries to login with /api/auth
import { getUserByEmail } from "@/database/data/user";


export default {
  providers: [
    Credentials({
      /**
       * Asynchronously authorizes the user with the given credentials.
       *
       * @param {Object} credentials - The user's login credentials.
       * @param {string} credentials.email - The user's email.
       * @param {string} credentials.password - The user's password.
       * @return {Promise<Object|null>} - A Promise that resolves to the user object if the credentials are valid, or null if they are not.
      */
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;


          const user = await getUserByEmail(email);


          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          );
        

          if (passwordsMatch) {

            const User: any = {
              id: user.id,
              name: user.name,
              email: user.email
            }
            return User
          }

          return null;
        }
      }

    })
  ],
} satisfies NextAuthConfig