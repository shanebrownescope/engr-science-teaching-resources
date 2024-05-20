"use client";

import { CreateCourseSchema } from "@/schemas";
import { Group, Box } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import createCourse from "@/actions/create/createCourse";
import { useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import styles from "@/styles/form.module.css";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type FormFields = z.infer<typeof CreateCourseSchema>;

const Courses = () => {
  useRequireAuth();
  const router = useRouter()
  const role = useCurrentRole()
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      courseName: "",
    },
    resolver: zodResolver(CreateCourseSchema), // Resolver for Zod schema validation
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError("root", { message: "" });
    setSuccess("");
    try {
      console.log(data);
      const results = await createCourse(data);
      console.log(results);
      if (results.error) {
        setError("root", { message: results.error });
      }

      if (results.success) {
        setSuccess(results.success);
      }
    } catch (error) {
      setError("root", { message: "Error" });
      console.log(error);
    }
  };

  return (
    <div className={styles.formAdminWrapper}>
      <p className={styles.formAdminTitle}> Create Course </p>
      <form 
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}>

        <div className="flex-col">
          <label> Course Name</label>
          <input
            className={errors.courseName && "input-error"}
            {...register("courseName")}
            type="text"
            placeholder="Enter course name"
            disabled={isSubmitting}
          />
          {errors.courseName && (
            <p className="error">{errors.courseName.message}</p>
          )}
        </div>
      
        <button 
          className={styles.formButton}
          type="submit" 
          disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Create"}
        </button>

        {errors.root && <FormError message={errors.root.message} />}
        {success && <FormSuccess message={success} />}
      </form>
    </div>
  );
};

export default Courses;
