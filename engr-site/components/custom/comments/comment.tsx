import { CommentFileData, CommentLinkData } from "@/utils/types";

import styles from "./comment.module.css";
type CommentProps = {
  authorId: number;
  authorName: string;
  commentText: string;
  uploadDate: string;
};

/**
 * Renders a comment.
 *
 * @param {CommentProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered Comment component.
 */
const Comment = ({
  authorId,
  authorName,
  commentText,
  uploadDate,
}: CommentProps) => {
  return (
    <div className={styles.container}>
      <div className="flex gap-p25 align-baseline">
        <p className={styles.author}> {authorName} </p>
        <p className={styles.uploadDate}> {uploadDate} </p>
      </div>

      <p className={styles.comment}> {commentText} </p>
    </div>
  );
};

export default Comment;
