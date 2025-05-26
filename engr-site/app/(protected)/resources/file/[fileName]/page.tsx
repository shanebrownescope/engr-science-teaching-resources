import { Textarea, Button } from "@mantine/core";

import { fetchFileById } from "@/actions/fetching/files/fetchFileById";

import { DisplayFile } from "@/app/(protected)/_components/DisplayFile";
import { FetchedCommentFileData, FetchedCommentLinkData, FetchedFile, FetchedReviewsFileData, FetchedSearchResults } from "@/utils/types_v2";
import { fetchCommentsByFileName } from "@/actions/fetching/comments/fetchCommentsByFileName";
import CommentFileThread from "@/components/custom/comments/thread/CommentFileThread";
import CommentForm from "@/components/custom/comments/form/CommentForm";
import { getCurrentUser } from "@/utils/authHelpers";
import { uploadFileComment } from "@/actions/comments/uploadFileComment";
import { revalidatePath } from "next/cache";
import SimilarResourcesData from "@/components/custom/similar-resources/SimilarResourcesData";
import requireAuth from "@/actions/auth/requireAuth";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { fetchFileByName } from "@/actions/fetching/files/fetchFileByName";
import { fetchSimilarResourcesByTags } from "@/actions/fetching/similarResources/fetchSimilarResourcesByTags";
import { ReviewsThread } from "@/components/custom/reviews/thread/ReviewsThread";
import { fetchReviewsByFileName } from "@/actions/fetching/reviews/fetchReviewsByFileName";
import { ReviewsFileData } from "@/utils/types_v2";
import { CreateReviewButton } from "@/components/custom/reviews/createButton/createReviewButton";
import { fetchReviewsByFileNameAndUserId } from "@/actions/fetching/reviews/fetchReviewsByFileNameAndUserId";


const ResourceFilePage = async ({
  params
}: {
  params: { fileName: string };
}) => {
  await requireAuth();

  const { fileName } = params;

  const user = await getCurrentUser();
  if (!user || !user.id) {
    console.log("No user is logged in")
    return;
  }

  const fileData = await fetchFileByName({ name: fileName });
  const similarResources: FetchedSearchResults = await fetchSimilarResourcesByTags({
    name: fileName,
    tags: fileData?.success?.tags || [],
  });
  const reviewsByUser: FetchedReviewsFileData | null = await fetchReviewsByFileNameAndUserId(fileName, user.id)
  const reviewsThread: FetchedReviewsFileData | null = await fetchReviewsByFileName(fileName)

  // const commentThread: FetchedCommentFileData | null = await fetchCommentsByFileName(fileName);
  // const handleFormSubmit = async (values: any) => {
  //   "use server";
  //   if (!user || !user.id) {
  //     return;
  //   }

  //   try {
  //     const results = await uploadFileComment({
  //       values: values,
  //       userId: user.id,
  //       fileName: fileName,
  //     });
  //     revalidatePath(
  //       `/resources/file/${fileName}`,
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div>
      {fileData.success && (
        <DisplayFile file={fileData.success} />
      )}

      <SimilarResourcesData similarResources={similarResources?.success} />

      <CreateReviewButton 
        type="file"
        resourceName={fileName}
        disabled={!!(reviewsByUser?.success?.length)}
      />
      <ReviewsThread reviews={reviewsThread?.success} />

      {/* <CommentForm handleFormSubmit={handleFormSubmit} />
      <CommentFileThread commentThread={commentThread?.success} /> */}
    </div>
  );
};

export default ResourceFilePage;
