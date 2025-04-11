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
import { FetchedCommentLinkData, FetchedSearchResults } from "@/utils/types_v2";
import { fetchSimilarResourcesByTags } from "@/actions/fetching/similarResources/fetchSimilarResourcesByTags";


const ResourceLinkPage = async ({
  params
}: {
  params: { linkName: string };
}) => {
  await requireAuth();

  const { linkName } = params;

  const user = await getCurrentUser();

  const linkData = await fetchLinkByName({ name: linkName });
  const similarResources: FetchedSearchResults = await fetchSimilarResourcesByTags({
    name: linkName,
    tags: linkData?.success?.tags || [],
  });
  const commentThread: FetchedCommentLinkData | null = await fetchCommentsByLinkName(linkName);

  const handleFormSubmit = async (values: any) => {
    "use server";
    if (!user || !user.id) {
      return;
    }

    try {
      const results = await uploadLinkComment({
        values: values,
        userId: user.id,
        linkName: linkName,
      });
      revalidatePath(
        `/resources/link/${linkName}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {linkData?.success && (
        <DisplayLink link={linkData?.success} />
      )}

      <SimilarResourcesData similarResources={similarResources?.success} />

      <CommentForm handleFormSubmit={handleFormSubmit} />
      <CommentLinkThread commentThread={commentThread?.success} />
    </div>
  );
};

export default ResourceLinkPage;
