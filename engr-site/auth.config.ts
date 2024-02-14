import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas"; //* need LoginSchem just in case user tries to login with /api/auth
import { getUserByEmail } from "@/database/data/user";


export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          //* user registered with name, email, password
          if (!user || !user.Password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.Password
          );
          
          if (passwordsMatch) {
            console.log("passwords match!")
            console.log({user})

            const User: any = {
              id: user.UserId,
              name: user.Name,
              email: user.Email
            }
            // return user;
            return User
          }

          return null;
        }
      }

    })
  ],
} satisfies NextAuthConfig

