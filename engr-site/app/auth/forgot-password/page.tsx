"use client";

import { ForgetPasswordSchema } from "@/schemas";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendResetPassword } from "@/actions/auth/sendResetPassword";

type FormFields = z.infer<typeof ForgetPasswordSchema>;

const ForgetPasswordPage = () => {
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
    <div>
      <h2> Forgot your password?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter email"
            disabled={isSubmitting}
          />
        </div>

        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Send reset email"}
        </button>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
