import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

import {
  DEFAULT_LOGIN_REDIRECT, 
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"


export default auth((req) => {
  const { nextUrl } = req;
  // console.log("== nextUrl: ", nextUrl)
  const isLoggedIn = !!req.auth //* !! turns to boolean

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  //* /api/auth/providers
  //* anyone can access this
  if (isApiAuthRoute) {
    return null;
  }

  //* ex. /admin
  //* redirect to settings page if logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  //* redirect to homepage if user not logged in 
  //* and on route that requires user to be logged in
  if (!isLoggedIn && !isPublicRoute) {
    console.log("not right: ", Response.redirect(new URL("/auth/login", nextUrl)))
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // //* redirect logged in user to homepage if on public route
  // if (isLoggedIn && isPublicRoute) {
  //   return Response.redirect(new URL("/home", nextUrl));
  // }

  //* do nothing, user on public route so everything is fine
  return null;
});




// Optionally, don't invoke Middleware on some paths
//* every single route expect next static files and next images are going to invoke middleware
//* Inokes middleware everywhere, so we decide in middleware what to do with those routes
//* uses regular expression, invokes middleware everytime when routes are used
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}