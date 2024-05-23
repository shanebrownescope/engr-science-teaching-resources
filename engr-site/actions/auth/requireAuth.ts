"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Middleware function to require authentication for a server action.
 *
 * This function checks if the user is authenticated by calling the `auth` function.
 * If the user is not authenticated, it redirects them to the login page.
 * Otherwise, it does nothing.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is authenticated or redirects to the login page.
 */
const requireAuth = async () => {
  const session = await auth();

  // Check if the user is logged in by checking if the session exists
  const isLoggedIn = !!session;

  if (!isLoggedIn) {
    redirect("/auth/login");
  } 

  return
};

export default requireAuth;
