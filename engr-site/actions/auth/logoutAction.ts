"use server"

import { signOut } from "@/auth"

/**
 * Server Action to handle user logout.
 * 
 * Calls the `signOut` function from the `@/auth` module to logout the user.
 * `signOut` is an async function that returns a Promise that resolves when the user is logged out.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is logged out.
 * 
 */
export const logoutAction = async () => {
  await signOut()
}
