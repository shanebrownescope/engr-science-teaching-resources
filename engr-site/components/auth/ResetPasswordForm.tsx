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
import styles from "@/styles/form.module.css";

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
    <div className={styles.formWrapper}>
      <label className={styles.title}> Reset password </label>

      <form className={`${styles.form} mt-2`} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Password</label>
          <input
            className={errors.password && "input-error"}
            {...register("password")}
            type="password"
            placeholder="Enter password"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <div className="flex-col">
          <label> Confirm password</label>
          <input
            className={errors.confirmPassword && "input-error"}
            {...register("confirmPassword")}
            type="password"
            placeholder="Enter password"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword.message}</p>
          )}
        </div>

        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}

        <button
          className={styles.formButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Reset password"}
        </button>

        <div className={styles.toLoginBtnWrapper}>
          <p className="text-center sub-text">
            {" "}
            Back to{" "}
            <a className={styles.toLoginBtn} href="/auth/login">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
