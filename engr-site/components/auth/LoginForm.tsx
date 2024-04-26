"use client";
import styles from "@/styles/form.module.css";
import { loginAction } from "@/actions/auth/loginAction";
import * as z from "zod";

import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";

import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubmitHandler, useForm } from "react-hook-form";
import {  useState } from "react";

type FormFields = z.infer<typeof LoginSchema>;


export const LoginForm = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema), // Resolver for Zod schema validation
  });


  const onSubmit: SubmitHandler<FormFields> = async(data) => {
    // Reset the error and success messages
    setError("root", { message: "" });
    setSuccess("");

    try {
      const validatedFields = LoginSchema.safeParse(data);

      if (!validatedFields.success) {
        setError("root", { message: "Fields are invalid" });
        return;
      }

      const result = await loginAction(data)

      console.log(result)

      if (result.error) {
        setError("root", { message: result.error });
      }

      if (result.success) {
        setSuccess(result.success);
      }

    } catch (error) {
      setError("root", { message: "Error" });
      console.log("-- error: ", error);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <p className={styles.title}>Login</p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} >
        <div className="flex-col">
          <label> Email </label>
          <input
            className={errors.email && "input-error"}
            {...register("email")}
            placeholder="Enter email"
            type="email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className={styles.error}> {errors.email.message} </p>
          )}        
        </div>

        <div className="flex-col">
          <label> Password </label>
          <input
            className={errors.password && "input-error"}
            placeholder="*****"
            type="password"
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password && (
            <p className={styles.error}> {errors.password.message} </p>
          )}
        </div>

        <FormError message={errors.root?.message} />
        <FormSuccess message={success} />

        <a 
          className={styles.forgotLink} 
          href="/auth/forgot-password"
        >
          Forgot password?
        </a>

        <button
          className={styles.formButton}
          type="submit"
          disabled={isSubmitting} 
        >
          Login
        </button>
      </form>
    </div>
  );
};
