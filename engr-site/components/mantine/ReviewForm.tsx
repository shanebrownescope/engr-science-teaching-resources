'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rating, TextInput, Textarea, Button } from '@mantine/core';

type ReviewFormProps = {
  resourceName: string;
  userId: string;
  type: string;
  updateAvgRating: ({}: any) => Promise<{
    failure?: string;
    success?: boolean;
  }>;
  uploadReview: ({}: any) => Promise<{
    failure?: string;
    success?: boolean;
  }>
};

export default function ReviewForm({
  resourceName,
  userId,
  type,
  updateAvgRating,
  uploadReview
}: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: '',
    comments: '',
    userPublicName: ''
  });

  // handle on change event for review form values
  const handleChange = (field: string, value: string | number) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // handle on submit event (update resource average rating and upload new review)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resultForUpdate = await updateAvgRating({ 
        [`${type}Name`]: resourceName, 
        newRating: reviewData.rating 
      });

      if (resultForUpdate.failure) {
        console.log("Failed to update resource average rating: ", resultForUpdate.failure)
        return
      }

      const resultForUpload = await uploadReview({ 
        values: reviewData, 
        userId: userId, 
        [`${type}Name`]: resourceName 
      });

      if (resultForUpload.failure) {
        console.log("Failed to upload resource review: ", resultForUpload.failure)
        return
      }

      router.push(`/resources/${type}/${resourceName}`);
      
    } catch (error) {
      console.log("Error occured when submitting resource review: ", error)
      return
    } finally {
      setIsLoading(false);
    }
  };

  // handle on cancel event
  const handleCancel = () => {
    router.push(`/resources/${type}/${resourceName}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">Your Rating</label>
        <Rating
          value={reviewData.rating}
          onChange={(value) => handleChange('rating', value)}
          fractions={2}
          count={5}
          size="lg"
        />
      </div>

      <TextInput
        label="Review Title"
        placeholder="Summarize your experience"
        value={reviewData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />

      <Textarea
        label="Your Review"
        placeholder="Share details about your experience with this resource"
        value={reviewData.comments}
        onChange={(e) => handleChange('comments', e.target.value)}
        required
        minRows={5}
      />

      <TextInput
        label="Display Name"
        placeholder="How you want your name to appear"
        value={reviewData.userPublicName}
        onChange={(e) => handleChange('userPublicName', e.target.value)}
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
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}