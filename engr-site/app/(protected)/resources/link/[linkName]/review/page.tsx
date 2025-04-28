import { redirect } from 'next/navigation';
import { Title, Container } from '@mantine/core';
import ReviewForm from '@/components/mantine/ReviewForm';
import { getCurrentUser } from '@/utils/authHelpers';
import { fetchReviewsByLinkNameAndUserId } from '@/actions/fetching/reviews/fetchReviewsByLinkNameAndUserId';
import requireAuth from '@/actions/auth/requireAuth';
import { FetchedReviewsLinkData } from '@/utils/types_v2';
import { updateLinkAvgRating } from '@/actions/update/links/updateLinkAvgRating';
import { uploadLinkReview } from '@/actions/reviews/uploadLinkReview';

export default async function CreateReviewPage({ 
  params 
}: { 
  params: { linkName: string } 
}) {
  let user: any
  try {
    // Server-side user authorization (must have an active session and no reviews already created for this resource)
    await requireAuth();

    user = await getCurrentUser();

    if (!user || !user.id) {
      return;
    }

    // Check for existing reviews
    const existingReviews: FetchedReviewsLinkData | null = await fetchReviewsByLinkNameAndUserId(
      params.linkName, 
      user.id
    );
    
    if (existingReviews?.success?.length) {
      console.log("Unauthorized: User already left a review for this resource")
      redirect('/unauthorized');
    }
  } catch (error) {
    console.log("Failed to authorize user: ", error)
    return
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">Write a Review</Title>
      <ReviewForm 
        resourceName={params.linkName}
        userId={user.id}
        type="link"
        updateAvgRating={updateLinkAvgRating}
        uploadReview={uploadLinkReview}
      />
    </Container>
  );
}