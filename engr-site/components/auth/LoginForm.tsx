"use client";
import styles from '@/styles/testAuth.module.css'
import { loginAction } from '@/actions/auth/loginAction';
import * as z from "zod"


import { FormSuccess } from '../FormSuccess';
import { FormError } from '../FormError';

import { LoginSchema } from '@/schemas'
import { useForm } from 'react-hook-form'
import { useTransition, useState } from 'react';

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof LoginSchema>>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  /**
   * Handle the login form submission
   *
   * @param {z.infer<typeof LoginSchema>} values - The form values
   */
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // Reset the error and success messages
    setError("");
    setSuccess("");

    // Make a transition to asyncronously log the user in
    startTransition(() => {
      /**
       * Attempt to login the user
       *
       * @param {Object} data - The login result
       */
      loginAction(values)
        .then((data) => {
          /**
           * If there was an error, set the error message
           * Otherwise, set the success message
           */
          setError(data?.error || "");
          setSuccess(data?.success || "");
        })
    })
  }


  return (
    <div className={styles.cardFormWrapper}>
      <p className={styles.title}>login form</p>
      <form 
        onSubmit={handleSubmit((onSubmit))}         
        className={styles.form}
      >

        <label> Email </label>
        <input 
          placeholder="Enter email"
          type="email"
          disabled={isPending}
          {...register('email')}
        /> 

        <label> Password </label>
        <input 
          placeholder="*****"
          type="password"
          disabled={isPending}
          {...register('password')}
        /> 

        <FormError message={error} />
        <FormSuccess message={success} />

        <a href="/auth/forgot-password">Forgot password?</a>

        <button 
          disabled={isSubmitting}
          type="submit"
        >
          Login
        </button>


      </form>
    </div>
  )
}

