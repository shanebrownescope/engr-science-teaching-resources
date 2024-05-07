import { Textarea, Button } from "@mantine/core";

import { fetchFileById } from "@/actions/fetching/files/fetchFileById";
import { fetchSimilarFilesByTags } from "@/actions/fetching/files/fetchSimilarFilesByTags";

import { DisplayFile } from "@/app/(protected)/_components/DisplayFile";
import { FetchedFile } from "@/utils/types";
import { fetchCommentsByFileId } from "@/actions/fetching/comments/fetchCommentsByFileId";
import CommentFileThread from "@/components/custom/comments/thread/CommentFileThread";
import CommentForm from "@/components/custom/comments/form/CommentForm";
import { getCurrentUser } from "@/utils/authHelpers";
import { uploadFileComment } from "@/actions/comments/uploadFileComment";
import { revalidatePath } from "next/cache";
import SimilarResourcesData from "@/components/custom/similar-resources/SimilarResourcesData";

type searchParams = {
  id: string;
};

const ResourceFilePage = async ({
  params,
  searchParams,
}: {
  params: { fileName: string };
  searchParams: searchParams;
}) => {
  const { fileName } = params;
  const { id } = searchParams;

  const user = await getCurrentUser();

  const fileData = await fetchFileById({ id: id });
  const similarFiles = await fetchSimilarFilesByTags({
    fileId: id,
    tags: fileData?.success?.tags || [],
  });
  const commentThread = await fetchCommentsByFileId(id);

  console.log("commentThread: ", commentThread);

  const handleFormSubmit = async (values: any) => {
    "use server";
    if (!user || !user.id) {
      return;
    }

    try {
      const results = await uploadFileComment({
        values: values,
        userId: user.id,
        fileId: id,
      });
      revalidatePath(
        `/resources/file/${fileName}?${new URLSearchParams({
          id: id,
        })}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-col gap-2">
      {fileData.success && (
        <DisplayFile file={fileData.success as FetchedFile} />
      )}

      <SimilarResourcesData similarResources={similarFiles?.success} type="file" />

      <CommentForm handleFormSubmit={handleFormSubmit} />
      <CommentFileThread commentThread={commentThread?.success} />
    </div>
  );
};

export default ResourceFilePage;
