type PendingUserDetailsProps = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: string;
  handleApprove: () => void;
  handleReject: () => void;
};

/**
 * Renders the pending user details.
 *
 * @param {PendingUserDetailsProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered PendingUserDetails component.
 */
export const PendingUserDetails = ({
  firstName,
  lastName,
  email,
  username,
  status,
  handleApprove,
  handleReject,
}: PendingUserDetailsProps) => {
  return (
    <div>
      <p>
        Name: {firstName} {lastName}
      </p>
      <p> Email: {email} </p>
      <p> Username: {username} </p>
      <p> Status: {status} </p>
      <button onClick={handleApprove}> Approve </button>
      <button onClick={handleReject}> Reject </button>
    </div>
  );
};
