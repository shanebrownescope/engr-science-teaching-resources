//* signout with next.auth on server
import { signOut } from "@/auth";
import { getCurrentUser } from "@/utils/authHelpers";
import styles from "./profile.module.css";
import requireAuth from "@/actions/auth/requireAuth";
import { Button } from "@mantine/core";
import { fetchUploadsByUserId } from "@/actions/fetching/uploads/fetchUploadsByUserId";
import { UploadedItemsList } from "./_components/UploadedItemsList";

const Profile = async () => {
  await requireAuth();

  const user = await getCurrentUser();

  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  const canViewUploads = user?.role === "admin" || user?.role === "instructor";

  const uploads =
    canViewUploads && user?.id
      ? await fetchUploadsByUserId(user.id)
      : null;

  return (
    <div className={styles.container}>
      <div className={styles.category}>
        <p> Username </p>
        <p> {user?.name} </p>
      </div>

      <div className={styles.category}>
        <p> Email </p>
        <p> {user?.email} </p>
      </div>

      <div className={styles.category}>
        <p> Role </p>
        <p> {user?.role} </p>
      </div>

      <form className={styles.signOut} action={handleSignOut}>
        <Button type="submit">Sign out</Button>
      </form>

      {canViewUploads && uploads?.success && (
        <UploadedItemsList
          files={uploads.success.files}
          links={uploads.success.links}
        />
      )}
    </div>
  );
};

export default Profile;
