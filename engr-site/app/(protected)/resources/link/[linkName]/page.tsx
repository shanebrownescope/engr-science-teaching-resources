import { Textarea, Button } from "@mantine/core";
import { fetchLinkById } from "@/actions/fetching/links/fetchLinkById";

import { DisplayLink } from "@/app/(protected)/_components/DisplayLink";
import { FetchedLink } from "@/utils/types";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/utils/authHelpers";
import { fetchCommentsByLinkName } from "@/actions/fetching/comments/fetchCommentsByLinkName";
import { uploadLinkComment } from "@/actions/comments/uploadLinkComment";
import { revalidatePath } from "next/cache";
import CommentForm from "@/components/custom/comments/form/CommentForm";
import CommentLinkThread from "@/components/custom/comments/thread/CommentLinkThread";
import SimilarResourcesData from "@/components/custom/similar-resources/SimilarResourcesData";
import requireAuth from "@/actions/auth/requireAuth";
import { fetchLinkByName } from "@/actions/fetching/links/fetchLinkByName";
import { FetchedCommentLinkData, FetchedReviewsFileData, FetchedReviewsLinkData, FetchedSearchResults } from "@/utils/types_v2";
import { fetchSimilarResourcesByTagsAndCourseTopics } from "@/actions/fetching/similarResources/fetchSimilarResourcesByTagsAndCourseTopics";
import { fetchReviewsByLinkName } from "@/actions/fetching/reviews/fetchReviewsByLinkName";
import { ReviewsThread } from "@/components/custom/reviews/thread/ReviewsThread";
import { ReviewsLinkData } from "@/utils/types_v2";
import { CreateReviewButton } from "@/components/custom/reviews/createButton/createReviewButton";
import { fetchReviewsByLinkNameAndUserId } from "@/actions/fetching/reviews/fetchReviewsByLinkNameAndUserId";

const ResourceLinkPage = async ({
  params
}: {
  params: { linkName: string };
}) => {
  await requireAuth();

  const { linkName } = params;

  const user = await getCurrentUser();
  if (!user || !user.id) {
    console.log("No user is logged in")
    return;
  }

  const linkData = await fetchLinkByName({ name: linkName });
  const similarResources: FetchedSearchResults = await fetchSimilarResourcesByTagsAndCourseTopics({
    name: linkName,
    tags: linkData?.success?.tags || [],
    courseTopics: linkData?.success?.courseTopics || []
  });
  const reviewsByUser: FetchedReviewsLinkData | null = await fetchReviewsByLinkNameAndUserId(linkName, user.id)
  const reviewsThread: FetchedReviewsLinkData | null = await fetchReviewsByLinkName(linkName)

  // const commentThread: FetchedCommentLinkData | null = await fetchCommentsByLinkName(linkName);
  // const handleFormSubmit = async (values: any) => {
  //   "use server";
  //   if (!user || !user.id) {
  //     return;
  //   }

  //   try {
  //     const results = await uploadLinkComment({
  //       values: values,
  //       userId: user.id,
  //       linkName: linkName,
  //     });
  //     revalidatePath(
  //       `/resources/link/${linkName}`
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div>
      {linkData?.success && (
        <DisplayLink link={linkData?.success} />
      )}

      <SimilarResourcesData similarResources={similarResources?.success} />

      <CreateReviewButton 
        type="link"
        resourceName={linkName}
        disabled={!!(reviewsByUser?.success?.length)}
      />
      <ReviewsThread reviews={reviewsThread?.success} />

      {/* <CommentForm handleFormSubmit={handleFormSubmit} />
      <CommentLinkThread commentThread={commentThread?.success} /> */}
    </div>
  );
};

export default ResourceLinkPage;
