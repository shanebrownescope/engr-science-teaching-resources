"use client";

import { CommentFileData, CommentLinkData } from "@/utils/types";
import { Button, Textarea } from "@mantine/core";
import React, { useState } from "react";
import Comment from "../comment";
import ContainerLayout from "../../containerLayout/ContainerLayout";

type CommentLinkThreadProps = {
  commentThread: CommentLinkData[] | undefined;
};

/**
 * Renders a comment link thread.
 *
 * @param {CommentLinkThreadProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered CommentLinkThread component.
 */
const CommentLinkThread = ({ commentThread }: CommentLinkThreadProps) => {
  const [viewCount, setViewCount] = useState(6);

  const handleViewMore = () => {
    setViewCount((prev) => prev + 6);
  };

  if (commentThread?.length === 0) {
    return <div>No comments</div>;
  }
  return (
    <ContainerLayout paddingTop="none" className="mt-4">
      {commentThread
        ?.slice(0, viewCount)
        .map((comment) => (
          <Comment
            key={comment.id}
            authorId={comment.userId}
            authorName={comment.name}
            commentText={comment.commentText}
            uploadDate={comment.uploadDate as string}
          />
        ))}

      {commentThread && viewCount < commentThread?.length && (
        <Button onClick={handleViewMore}> View more </Button>
      )}
    </ContainerLayout>
  );
};

export default CommentLinkThread;
