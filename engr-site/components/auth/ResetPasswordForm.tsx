"use client";

import { ForgetPasswordSchema, ResetPasswordSchema } from "@/schemas";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordAction } from "@/actions/auth/resetPassword";
import { useSearchParams } from "next/navigation";

type FormFields = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ResetPasswordSchema), // Resolver for Zod schema validation
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
    
      if (data.password !== data.confirmPassword) {
        setError("root", { message: "Passwords do not match" });
        return;
      }

      const results = await resetPasswordAction(data, token);
      // console.log(results);
      if (results.failure) {
        setError("root", { message: results.failure });
        return;
      }

      if (results.success) {
        setSuccess(results.success);
        return;
      }
    } catch (error) {
      setError("root", { message: "Error" });
      console.log(error);
    }
  };

  return (
    <div>
      <h2> Reset password?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter password"
            disabled={isSubmitting}
          />
        </div>
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}

        <div className="flex-col">
          <label> Confirm password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Enter password"
            disabled={isSubmitting}
          />
        </div>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Reset password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
