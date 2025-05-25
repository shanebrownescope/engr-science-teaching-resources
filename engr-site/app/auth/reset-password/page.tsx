import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { searchParams } from "@/utils/types_v2";

const ResetPasswordPage = ({ searchParams }: searchParams) => {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
