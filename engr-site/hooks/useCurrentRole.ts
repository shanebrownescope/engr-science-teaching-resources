/**  
 ** used for client components
 ** no need to do '.data?.use?.role' in components
 ** decoding the session
*/

import { useSession } from "next-auth/react";


/**
 * Custom hook to get the current user's role from the session data.
 *
 * @return {string | undefined} The user's role, or undefined if the session data is not available.
 */
export const useCurrentRole = () => {
  const session = useSession()

  return session.data?.user?.role;
}
