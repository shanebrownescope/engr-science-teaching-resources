import { redirect } from 'next/navigation';
import { Title, Container } from '@mantine/core';
import ReviewForm from '@/components/mantine/ReviewForm';
import { getCurrentUser } from '@/utils/authHelpers';
import { fetchReviewsByFileNameAndUserId } from '@/actions/fetching/reviews/fetchReviewsByFileNameAndUserId';
import requireAuth from '@/actions/auth/requireAuth';
import { FetchedReviewsFileData } from '@/utils/types_v2';
import { updateFileAvgRating } from '@/actions/update/files/updateFileAvgRating';
import { uploadFileReview } from '@/actions/reviews/uploadFileReview';

export default async function CreateReviewPage({ 
  params 
}: { 
  params: { fileName: string } 
}) {
  let user: any
  // Server-side user authorization (must have an active session and no reviews already created for this resource)
  await requireAuth();

  user = await getCurrentUser();

  if (!user || !user.id) {
    return;
  }

  // Check for existing reviews
  const existingReviews: FetchedReviewsFileData | null = await fetchReviewsByFileNameAndUserId(
    params.fileName, 
    user.id
  );
  
  if (existingReviews?.success?.length) {
    console.log("Unauthorized: User already left a review for this resource")
    redirect('/unauthorized');
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">Write a Review</Title>
      <ReviewForm 
        resourceName={params.fileName}
        userId={user.id}
        type="file"
        updateAvgRating={updateFileAvgRating}
        uploadReview={uploadFileReview}
      />
    </Container>
  );
}