"use client";

import { startTransition, useOptimistic } from "react";
import PendingUserListPaginated from "@/components/custom/PendingUsersListPaginated";

const PendingUsersClientComponent = ({ data }: { data: any }) => {
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(data);

  const handleApprove = async (userId: string) => {
    startTransition(() => {
      console.log("approving user: ", userId);
      setOptimisticUsers((state: any) =>
        state?.filter((user: any) =>
          user.UserId !== userId
        )
      );
    });
  };

  const handleReject = async (userId: string) => {
    console.log("rejecting user: ", userId);
    setOptimisticUsers((pendingUsers: any) =>
      pendingUsers?.map((user: any) =>
        user.UserId === userId ? { ...user, AccountStatus: "rejected" } : user
      )
    );
  };

  console.log("optimisticUsers: ", optimisticUsers.map((user: any) => user.AccountStatus));


  return (
    <div>
      <PendingUserListPaginated
        data={optimisticUsers}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </div>
  );
};

export default PendingUsersClientComponent;
