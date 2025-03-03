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
import requireAuth from "@/actions/auth/requireAuth";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";

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
  await requireAuth();

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
        })}`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="resource-page-container">
      <div className="resource-content-section">
        {fileData.success && (
          <DisplayFile file={fileData.success as FetchedFile} />
        )}
      </div>

      <div className="resource-sidebar-section">
        <section className="similar-resources-section">
          <h2 className="section-title">Similar Resources</h2>
          <SimilarResourcesData
            similarResources={similarFiles?.success}
            type="file"
          />
        </section>

        <section className="comments-section">
          <h2 className="section-title">Discussion</h2>
          <CommentForm handleFormSubmit={handleFormSubmit} />
          <CommentFileThread commentThread={commentThread?.success} />
        </section>
      </div>

      <style jsx>{`
        .resource-page-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .resource-content-section {
          width: 100%;
        }
        
        .resource-sidebar-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eaeaea;
        }
        
        .similar-resources-section,
        .comments-section {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        @media (min-width: 1024px) {
          .resource-page-container {
            flex-direction: row;
            align-items: flex-start;
          }
          
          .resource-content-section {
            flex: 1;
            position: sticky;
            top: 2rem;
          }
          
          .resource-sidebar-section {
            width: 350px;
            flex-shrink: 0;
            margin-left: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResourceFilePage;