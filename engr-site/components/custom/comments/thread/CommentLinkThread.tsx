"use client";

import { CommentFileData, CommentLinkData } from "@/utils/types";
import { Button, Textarea } from "@mantine/core";
import React, { useState } from "react";
import Comment from "../comment";

type CommentLinkThreadProps = {
  commentThread: CommentLinkData[] | undefined;
};

const CommentLinkThread = ({ commentThread }: CommentLinkThreadProps) => {
  const [viewCount ,setViewCount] = useState(6)

  const handleViewMore = () => {
    setViewCount(prev => prev + 6)
  }

  if (commentThread?.length === 0) {
    return <div>No comments</div>;
  }
  return (
    <div>
      {commentThread?.slice(0, viewCount).map((comment) => (
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
    </div>
  );
};

export default CommentLinkThread;
