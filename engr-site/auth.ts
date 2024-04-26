import NextAuth, { type DefaultSession } from "next-auth"

import { TypeORMAdapter } from "@auth/typeorm-adapter"
import authConfig from "@/auth.config"
import { getUserById } from "./database/data/user"
// import { ConnectionOptions } from "typeorm"

// const CONNECTION: ConnectionOptions = {
//   type: "mysql",
//   host: process.env.HOST,
//   port: 3306,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// }
type ExtendedUser = DefaultSession["user"] & {
  role: "admin" | "instructor"
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

import { JWT } from "next-auth/jwt"

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
      // console.log({ sessionToken: token, session })
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
  adapter: TypeORMAdapter(`${process.env.CONNECT_STRING}`),
  // adapter: TypeORMAdapter(CONNECTION),
  session: { strategy: "jwt" },
  ...authConfig,

})
