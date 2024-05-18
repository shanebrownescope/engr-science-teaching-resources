import NextAuth, { type DefaultSession } from "next-auth"

import authConfig from "@/auth.config"
import { getUserById } from "./database/data/user"
// import { ConnectionOptions } from "typeorm"
import { TypeORMAdapter } from '@auth/typeorm-adapter';
import { JWT } from "next-auth/jwt"

// import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"

type ExtendedUser = DefaultSession["user"] & {
  role: "admin" | "instructor"
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "instructor"
  }
}


//* handlers: how next auth handles http requests
//* auth: rest of application can use to check if user is logged in
//* callbacks: asynchronous functions you can use to control what happens when an action is performed 
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ session, token }) {
      //* adds id and role to session from token

      //* console.log token and session
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role 
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub)

      if (!existingUser) {
        return token
      }
      
      //* adds role to token
      token.role = existingUser.role

      return token;
    },
  },
  // adapter: TypeORMAdapter(process.env.AUTH_TYPEORM_CONNECTION!),
  session: { strategy: "jwt" },
  ...authConfig,

})
