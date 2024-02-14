//* signout with next.auth on server
import { signOut } from "@/auth"
import { getCurrentUser } from "@/utils/authHelpers"
import styles from './profile.module.css'

const Profile = async () => {
  /**
   * * signout if using "use client"
  import { useCurrentUser } from "@/hooks/useCurrentUser";
  import { logoutAction } from "@/actions/auth/logoutAction"
  
  const user = useCurrentUser()
  const handleSignOut = () => {
      logoutAction()
  }

    return (
      <div>
        {JSON.stringify({user})}
        <button onClick={handleSignOut} type="submit">
          Sign out
        </button>
      </div>
    )
  */



  const user = await getCurrentUser()

  const handleSignOut = async() => {
    'use server';
    await signOut()
  }

  return (
    <div className={styles.container}> 

      
        <div className={styles.category} >
          <p> Username </p>
          <p> {user?.name} </p>
        </div>

        <div className={styles.category} >
          <p> Email </p>
          <p> {user?.email} </p>
        </div>


        <div className={styles.category} >
          <p> Role </p>
          <p> {user?.role} </p>
        </div>

      
      <form className={styles.signOut} action={handleSignOut}>
        <button 
          type="submit"
        > 
          Sign out
        </button>
      </form>
    </div>
  )
}

export default Profile