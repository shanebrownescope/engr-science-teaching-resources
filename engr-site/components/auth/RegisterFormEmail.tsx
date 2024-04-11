"use client";

import Link from "next/link";
import styles from "@/styles/testAuth.module.css";
import * as z from "zod";

import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";

import { registerAction } from "@/actions/auth/registerAction";

import { useForm, SubmitHandler } from "react-hook-form";
import { useTransition, useState } from "react";
import { RegisterFormEmailSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendApprovalRequestToTeam, sendUserRegistrationConfirmation } from "@/actions/auth/register";
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
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: '',
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

      const { email } = validatedFields.data;

      const approvalResults = await sendApprovalRequestToTeam(validatedFields.data)
      console.log(approvalResults)
      if (approvalResults.failure) {
        console.log("here1")
        setError("root", { message: approvalResults.failure });
        return; // Stop further processing
      }

      const confirmationResults = await sendUserRegistrationConfirmation({userEmail: email})
      if (confirmationResults.failure) {
        console.log("here2")
        setError("root", { message: confirmationResults.failure });
        return; // Stop further processing

      }

      console.log("Both approval request and registration confirmation email sent successfully");
      setSuccess("Success! Check your email for confirmation and an approval request will be sent.");
  

      
    } catch (error) {
      setError("root", { message: "Error" });
      console.log(error);
    }
  };

  return (
    <div className={styles.cardFormWrapper}>
      <label> Register Form </label>
      <p className={styles.textBlack} >
        Once you submit, you will be verified and sent an email once approved to
        create an account
      </p>
      <p className={styles.title}>Register form</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label> First Name </label>
        <input
          placeholder="Enter first name"
          type="text"
          disabled={isSubmitting}
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className={styles.error}> {errors.firstName.message} </p>
        )}

        <label> Last Name </label>
        <input
          placeholder="Enter last name"
          type="text"
          disabled={isSubmitting}
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className={styles.error}> {errors.lastName.message} </p>
        )}

        <label> Email </label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter email"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className={styles.error}> {errors.email.message} </p>
        )}

        <label> Username </label>
        <input
          {...register("username")}
          type="text"
          placeholder="Enter Username"
          disabled={isSubmitting}
        />
        {errors.username && (
          <p className={styles.error}> {errors.username.message} </p>
        )}

        <label> Password </label>
        <input 
          placeholder="*****"
          type="password"
          disabled={isSubmitting}
          {...register('password')}
        /> 
        { errors.password && <p className={styles.error} >{errors.password.message} </p>}

        {errors.root && <FormError message={errors.root.message} />}
        {success &&<FormSuccess message={success} />}

        <button disabled={isSubmitting} type="submit">
          Register
        </button>

        <Link href="/auth/login" className={styles.toLoginBtn}>
          Already have an account?
        </Link>
      </form>
    </div>
  );
};
