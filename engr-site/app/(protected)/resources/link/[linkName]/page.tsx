import { Textarea, Button } from "@mantine/core";
import { fetchLinkById } from "@/actions/fetching/links/fetchLinkById";
import { fetchSimilarLinksByTags } from "@/actions/fetching/links/fetchSimilarLinksByTags";

import { DisplayLink } from "@/app/(protected)/_components/DisplayLink";
import { FetchedLink } from "@/utils/types";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/utils/authHelpers";
import { fetchCommentsByLinkId } from "@/actions/fetching/comments/fetchCommentsByLinkId";
import { uploadLinkComment } from "@/actions/comments/uploadLinkComment";
import { revalidatePath } from "next/cache";
import CommentForm from "@/components/custom/comments/form/CommentForm";
import CommentLinkThread from "@/components/custom/comments/thread/CommentLinkThread";
import SimilarResourcesData from "@/components/custom/similar-resources/SimilarResourcesData";
import requireAuth from "@/actions/auth/requireAuth";

type searchParams = {
  id: string;
  searchParams: { [key: string]: string | string[] | undefined };
};

const ResourceLinkPage = async ({
  params,
  searchParams,
}: {
  params: { linkName: string };
  searchParams: searchParams;
}) => {
  await requireAuth();

  const { linkName } = params;
  const { id } = searchParams;

  const user = await getCurrentUser();

  const linkData = await fetchLinkById({ id: id });
  const similarLinks = await fetchSimilarLinksByTags({
    linkId: id,
    tags: linkData?.success?.tags || [],
  });
  const commentThread = await fetchCommentsByLinkId(id);

  console.log("commentThread: ", commentThread);

  const handleFormSubmit = async (values: any) => {
    "use server";
    if (!user || !user.id) {
      return;
    }

    try {
      const results = await uploadLinkComment({
        values: values,
        userId: user.id,
        linkId: id,
      });
      revalidatePath(
        `/resources/link/${linkName}?${new URLSearchParams({
          id: id,
        })}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2em" }}>
      {linkData?.success && (
        <DisplayLink link={linkData.success as FetchedLink} />
      )}

      <SimilarResourcesData
        similarResources={similarLinks?.success}
        type="link"
      />

      <CommentForm handleFormSubmit={handleFormSubmit} />
      <CommentLinkThread commentThread={commentThread?.success} />
    </div>
  );
};

export default ResourceLinkPage;
