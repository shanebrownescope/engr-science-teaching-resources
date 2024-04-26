"use client";

import Link from "next/link";
import styles from "@/styles/testAuth.module.css";
import * as z from "zod";

import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";

import { registerAction } from "@/actions/auth/registerActionOld";

import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { RegisterSchema } from "@/schemas";

// ?: add dropdown for role (admin, instructor, student) for admin dashboard maybe
export const RegisterForm = () => {
  //* used for displaying success and failure messages
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //* used for disabling buttons and displaying loading UI
  const [isPending, startTransition] = useTransition();

  //* values for form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    //* disable buttons when performing registerAction()
    startTransition(() => {
      registerAction(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div className={styles.cardFormWrapper}>
      <p className={styles.title}>Register form</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label> Name </label>
        <input
          placeholder="Enter Name"
          disabled={isPending}
          {...register("name")}
        />
        {errors.name && <p>errors.name.message</p>}

        <label> Email </label>
        <input
          placeholder="example@email.com"
          type="email"
          disabled={isPending}
          {...register("email")}
        />
        {errors.email && <p>errors.email.message</p>}

        <label> Password </label>
        <input
          placeholder="*****"
          type="password"
          disabled={isPending}
          {...register("password")}
        />
        {errors.password && <p>errors.password.message</p>}

        <FormError message={error} />
        <FormSuccess message={success} />

        <button disabled={isPending} type="submit">
          Create an account
        </button>

        <Link href="/auth/login" className={styles.toLoginBtn}>
          Alreay have an account?
        </Link>
      </form>
    </div>
  );
};
