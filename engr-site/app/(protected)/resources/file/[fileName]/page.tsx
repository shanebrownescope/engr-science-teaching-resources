import { Textarea, Button } from "@mantine/core";

import { DisplayFile } from "@/app/(protected)/_components/DisplayFile";
import { FetchedFile, FetchedReviewsFileData, FetchedSearchResults } from "@/utils/types_v2";
import { getCurrentUser } from "@/utils/authHelpers";
import { revalidatePath } from "next/cache";
import SimilarResourcesData from "@/components/custom/similar-resources/SimilarResourcesData";
import requireAuth from "@/actions/auth/requireAuth";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { fetchFileByName } from "@/actions/fetching/files/fetchFileByName";
import { fetchSimilarResourcesByTagsAndCourseTopics } from "@/actions/fetching/similarResources/fetchSimilarResourcesByTagsAndCourseTopics";
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
  const similarResources: FetchedSearchResults = await fetchSimilarResourcesByTagsAndCourseTopics({
    name: fileName,
    tags: fileData?.success?.tags || [],
    courseTopics: fileData?.success?.courseTopics || []
  });
  const reviewsByUser: FetchedReviewsFileData | null = await fetchReviewsByFileNameAndUserId(fileName, user.id)
  const reviewsThread: FetchedReviewsFileData | null = await fetchReviewsByFileName(fileName)

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
    </div>
  );
};

export default ResourceFilePage;
