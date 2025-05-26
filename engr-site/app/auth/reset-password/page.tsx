import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { searchParams } from "@/utils/types";

const ResetPasswordPage = ({ searchParams }: searchParams) => {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
