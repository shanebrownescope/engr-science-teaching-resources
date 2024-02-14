/**  
 ** used for client components
 ** no need to do '.data?.use?.role' in components
 ** decoding the session
*/

import { useSession } from "next-auth/react";


export const useCurrentRole = () => {
  const session = useSession()

  return session.data?.user?.role;
}