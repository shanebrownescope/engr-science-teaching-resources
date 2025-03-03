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
        })}`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="resource-page-container">
      <div className="resource-content-section">
        {linkData?.success && (
          <DisplayLink link={linkData.success as FetchedLink} />
        )}
      </div>

      <div className="resource-sidebar-section">
        <section className="similar-resources-section">
          <h2 className="section-title">Similar Resources</h2>
          <SimilarResourcesData
            similarResources={similarLinks?.success}
            type="link"
          />
        </section>

        <section className="comments-section">
          <h2 className="section-title">Discussion</h2>
          <CommentForm handleFormSubmit={handleFormSubmit} />
          <CommentLinkThread commentThread={commentThread?.success} />
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

export default ResourceLinkPage;