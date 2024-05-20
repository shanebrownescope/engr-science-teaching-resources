export const runtime = 'nodejs';
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
            // return user;
            return User
          }

          return null;
        }
      }

    })
  ],
} satisfies NextAuthConfig