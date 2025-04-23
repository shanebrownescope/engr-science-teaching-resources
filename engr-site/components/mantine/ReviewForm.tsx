"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Rating, TextInput, Textarea, Button, Title, Container } from '@mantine/core';
import { Notification } from '@mantine/core';
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import classes from "./ReviewForm.module.css";
import Link from "next/link";

type ReviewFormProps = {
  reviewData: {
    rating: number;
    title: string;
    comments: string;
    userPublicName: string;
  };
  isLoading: boolean;
  onChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ReviewForm({
  reviewData,
  isLoading,
  onChange,
  onSubmit,
  onCancel
}: ReviewFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">Your Rating</label>
        <Rating
          value={reviewData.rating}
          onChange={(value) => onChange('rating', value)}
          fractions={2}
          count={5}
          size="lg"
        />
      </div>

      <TextInput
        label="Review Title"
        placeholder="Summarize your experience"
        value={reviewData.title}
        onChange={(e) => onChange('title', e.target.value)}
        required
      />

      <Textarea
        label="Your Review"
        placeholder="Share details about your experience with this resource"
        value={reviewData.comments}
        onChange={(e) => onChange('comments', e.target.value)}
        required
        minRows={5}
      />

      <TextInput
        label="Display Name"
        placeholder="How you want your name to appear"
        value={reviewData.userPublicName}
        onChange={(e) => onChange('userPublicName', e.target.value)}
        required
      />

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          loading={isLoading}
          loaderProps={{ type: 'dots' }}
        >
          Submit Review
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}