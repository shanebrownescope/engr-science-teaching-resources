"use client";

import { ForgetPasswordSchema } from "@/schemas";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendResetPassword } from "@/actions/auth/sendResetPassword";
import styles from "@/styles/form.module.css";

type FormFields = z.infer<typeof ForgetPasswordSchema>;

const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ForgetPasswordSchema), // Resolver for Zod schema validation
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
      const results = await sendResetPassword(data);
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
      <p className={styles.title}> Forgot your password?</p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Email</label>
          <input
            className={errors.email && "input-error"}
            {...register("email")}
            type="email"
            placeholder="Enter email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className={styles.error}> {errors.email.message} </p>
          )}        
        </div>

        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}

        <button 
          className={styles.formButton}
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Send reset email"}
        </button>

        <div className={styles.toLoginBtnWrapper}>
          <p className="text-center sub-text"> Back to {" "}
            <a 
              className={styles.toLoginBtn}
              href="/auth/login"
            >
              Login
            </a>
          </p>
        </div>
        
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
