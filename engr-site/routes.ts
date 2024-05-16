/**
 ** An array of routes that are accessible to public
 ** These routes do not require authentication
 ** @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/acknowledgments"
];


/**
 ** An array of routes that are used for authentication
 ** These routes will redirect logged in users to /home
 ** @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  // "/auth/reset-password/[token]",
  "/auth/reset-password"
];

/**
 ** An array of routes that are only accessible 
 */

/**
 ** The Prefix for API authentication routes
 ** Routes start with this prefix are used for API authentication purposes
 * @type {string[]}
 */
export const apiAuthPrefix = "/api/auth";


/**
 ** The default redirect path after logging in
 ** Can change default redirect page anytime
 * @type {string[]}
 */
export const DEFAULT_LOGIN_REDIRECT = "/home"