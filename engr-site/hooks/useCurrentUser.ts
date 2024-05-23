/**
 ** used for client components
 ** no need to do '.data?.user' in components
 ** decoding the session
 */

import { useSession } from "next-auth/react";

/**
 * Returns the current user data from the session.
 *
 * @return {Object | undefined} The user data from the session, or undefined if the session data is not available.
 */
export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};
