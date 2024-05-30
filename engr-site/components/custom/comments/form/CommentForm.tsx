"use client";

import React, { useState } from "react";
import { Textarea, Button } from "@mantine/core";
import { CommentSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

type FormFields = z.infer<typeof CommentSchema>;

type CommentFormProps = {
  handleFormSubmit: (data: FormFields) => void;
};

/**
 * Renders a comment form.
 *
 * @param {CommentFormProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered CommentForm component.
 */
const CommentForm = ({ handleFormSubmit }: CommentFormProps) => {
  const [success, setSuccess] = useState<string>("");
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      commentText: "",
    },
    resolver: zodResolver(CommentSchema),
  });

  const commentText = watch("commentText");
  console.log("commentText: ", commentText);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setSuccess("");
    try {
      await handleFormSubmit(data);
    } catch (error) {
      setError("root", { message: "Error" });
      console.log(error);
    }
  };

  return (
    <div className="comment-container">
      <h3>Comments</h3>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Textarea
            {...register("commentText", { required: true })}
            placeholder="Enter your comment..."
            minRows={2}
            mb="md"
          />
          <Button
            type="submit"
            variant="filled"
            style={{ width: "100%" }}
            disabled={isSubmitting || commentText.length === 0}
          >
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CommentForm;
