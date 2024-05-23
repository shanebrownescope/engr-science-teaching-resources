import requireAuth from "@/actions/auth/requireAuth";
import { fetchPendingUsers } from "@/actions/fetching/users/fetchPendingUsers";
import {
  approveUser,
  sendUserApprovalEmail,
} from "@/actions/update/approveUser";
import {
  rejectUser,
  sendUserRejectionEmail,
} from "@/actions/update/rejectUser";
import PendingUserListPaginated from "@/components/custom/PendingUser/PendingUsersListPaginated";

export type HandleUserActionProps = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type sendUserUpdateEmailProps = {
  email: string;
  firstName: string;
  lastName: string;
};
const PendingUsersPage = async () => {
  await requireAuth();

  const pendingUsers = await fetchPendingUsers();


  const handleApprove = async ({
    userId,
    email,
    firstName,
    lastName,
  }: HandleUserActionProps) => {
    "use server";
    console.log("approving user: ", userId);
    await approveUser(userId);
    await sendUserApprovalEmail({ email, firstName, lastName });
  };

  const handleReject = async ({
    userId,
    email,
    firstName,
    lastName,
  }: HandleUserActionProps) => {
    "use server";
    console.log("rejecting user: ", userId);
    await rejectUser(userId);

    await sendUserRejectionEmail({ email, firstName, lastName });
  };

  return (
    <div>
      {'success' in pendingUsers &&  (
        <PendingUserListPaginated
          data={pendingUsers.success}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      )}

      {'failure' in pendingUsers && <p>No pending users</p>}
    </div>
  );
};

export default PendingUsersPage;
