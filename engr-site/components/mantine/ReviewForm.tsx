'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rating, TextInput, Textarea, Button, Stack, Title, Text, Group } from '@mantine/core';
import ContainerLayout from '../custom/containerLayout/ContainerLayout';
import classes from './ReviewForm.module.css';

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
    <ContainerLayout paddingTop='none'>
      <form onSubmit={handleSubmit} className={classes.form}>
        <Stack gap="lg">
          <div>
            <Text fw={500} mb="sm">Your Rating</Text>
            <Rating
              value={reviewData.rating}
              onChange={(value) => handleChange('rating', value)}
              fractions={2}
              count={5}
              size="xl"
              className={classes.rating}
            />
          </div>

          <TextInput
            label="Review Title"
            placeholder="Summarize your experience"
            value={reviewData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            size="md"
          />

          <Textarea
            label="Your Review"
            placeholder="Share details about your experience with this resource"
            value={reviewData.comments}
            onChange={(e) => handleChange('comments', e.target.value)}
            required
            minRows={5}
            size="md"
            autosize
          />

          <TextInput
            label="Display Name"
            placeholder="How you want your name to appear"
            value={reviewData.userPublicName}
            onChange={(e) => handleChange('userPublicName', e.target.value)}
            required
            size="md"
          />

          <Group justify="flex-end" mt="xl" gap="md">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loaderProps={{ type: 'dots' }}
              size="md"
            >
              Submit Review
            </Button>
          </Group>
        </Stack>
      </form>
    </ContainerLayout>
  );
}