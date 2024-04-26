"use client";

import Link from "next/link";
import styles from "@/styles/form.module.css";
import * as z from "zod";

import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";

import { registerAction } from "@/actions/auth/registerActionOld";

import { useForm, SubmitHandler } from "react-hook-form";
import { useTransition, useState } from "react";
import { RegisterFormEmailSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendApprovalRequestToTeam,
  sendUserRegistrationConfirmation,
} from "@/actions/auth/register";
type FormFields = z.infer<typeof RegisterFormEmailSchema>;

// ?: add dropdown for role (admin, instructor, student) for admin dashboard maybe
export const RegisterFormEmail = () => {
  //* used for displaying success and failure messages
  const [success, setSuccess] = useState<string | undefined>("");

  //* values for form
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(RegisterFormEmailSchema), // Resolver for Zod schema validation
  });

  const watchedEmail = watch("email");
  console.log("-- watchedEmail: ", watchedEmail);

  const watchedUserName = watch("username");
  console.log("-- watchedUserName: ", watchedUserName);

  const watchedFirstName = watch("firstName");
  console.log("-- watchedFirstName: ", watchedFirstName);

  const watchedLastName = watch("lastName");
  console.log("-- watchedLastName: ", watchedLastName);

  const watchedPassword = watch("password");
  console.log("-- watchedPassword: ", watchedPassword);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");

    try {
      console.log(data);
      // Attempt to parse and validate the input data against the RegisterFormEmailSchema
      const validatedFields = RegisterFormEmailSchema.safeParse(data);

      // The data is not valid, return an error
      if (!validatedFields.success) {
        setError("root", { message: "Fields are invalid" });
        return;
      }

      const { email, firstName, lastName } = validatedFields.data;

      const approvalResults = await sendApprovalRequestToTeam(
        validatedFields.data
      );
      console.log(approvalResults);
      if (approvalResults.failure) {
        console.log("here1");
        setError("root", { message: approvalResults.failure });
        return; // Stop further processing
      }

      const confirmationResults = await sendUserRegistrationConfirmation(
        email,
        firstName,
        lastName
      );
      if (confirmationResults.failure) {
        console.log("here2");
        setError("root", { message: confirmationResults.failure });
        return; // Stop further processing
      }

      console.log(
        "Both approval request and registration confirmation email sent successfully"
      );
      setSuccess(
        "Success! Check your email for confirmation and an approval request will be sent."
      );
    } catch (error) {
      setError("root", { message: "Error" });
      console.log(error);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <p className={styles.title}> Register </p>

      <p className="sub-text mt-1 mb-2">
        You will be verified by our team before you can login. You'll receive an
        email when your account is approved then you will be able to login.
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <label> First Name </label>
          <input
            className={errors.firstName && "input-error"}
            {...register("firstName")}
            placeholder="Enter first name"
            type="text"
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className={styles.error}> {errors.firstName.message} </p>
          )}
        </div>

        <div className="flex-col">
          <label> Last Name </label>
          <input
            className={errors.lastName && "input-error"}
            {...register("lastName")}
            placeholder="Enter last name"
            type="text"
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className={styles.error}> {errors.lastName.message} </p>
          )}
        </div>

        <div className="flex-col">
          <label> Email </label>
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

        <div className="flex-col">
          <label> Username </label>
          <input
            className={errors.username && "input-error"}
            {...register("username")}
            type="text"
            placeholder="Enter Username"
            disabled={isSubmitting}
          />
          {errors.username && (
            <p className={styles.error}> {errors.username.message} </p>
          )}
        </div>

        <div className="flex-col">
          <label> Password </label>
          <input
            className={errors.lastName && "input-error"}
            {...register("password")}
            placeholder="*****"
            type="password"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message} </p>
          )}
        </div>

        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}

        <button
          className={styles.formButton}
          type="submit"
          disabled={isSubmitting}
        >
          Register
        </button>

        <div className={styles.toLoginBtnWrapper}>
          <p className="text-center sub-text">
            {" "}
            Already have an account?{" "}
            <Link href="/auth/login" className={styles.toLoginBtn}>
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
