import { Stack, Text, Group } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import Review from '@/components/custom/reviews/Review';
import classes from './ReviewsThread.module.css'; // Create this CSS module for custom styles
import ContainerLayout from '../../containerLayout/ContainerLayout';

type ReviewsThreadProps = {
  reviews: any[] | undefined;
};

export function ReviewsThread({ 
  reviews
}: ReviewsThreadProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <ContainerLayout paddingTop="md">
        <h5 className="mb-4">Reviews (0)</h5>
        <div className={classes.noReviews}>
          <Text c="dimmed" mt="xs">
            Be the first to share your thoughts...
          </Text>
        </div>
      </ContainerLayout>
    );
  }

  return (
    <ContainerLayout paddingTop="md">
      <Stack gap="lg">
        <h5 className="mb-4">Reviews ({reviews.length})</h5>
        
        <Stack gap="md">
          {reviews.map((review) => (
            <Review 
              key={review.id} 
              rating={review.rating}
              title={review.title}
              comments={review.comments}
              userPublicName={review.userPublicName}
              uploadDate={review.uploadDate}
            />
          ))}
        </Stack>
      </Stack>
    </ContainerLayout>
  );
}