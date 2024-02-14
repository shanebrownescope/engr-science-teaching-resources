/**  
 ** used for client components
 ** no need to do '.data?.user' in components
 ** decoding the session
*/

import { useSession } from "next-auth/react";


export const useCurrentUser = () => {
  const session = useSession()

  return session.data?.user
}