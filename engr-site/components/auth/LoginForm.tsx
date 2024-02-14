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
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof LoginSchema>>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      loginAction(values)
        .then((data) => {
          setError(data?.error)
          setSuccess(data?.success)
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

        <button 
          disabled={isPending}
          type="submit"
        >
          Login
        </button>


      </form>
    </div>
  )
}

