import React from "react";
import styles from "./Document.module.css"; // Make sure to create this CSS file in the same directory

export const Document = () => {
  const imageUrl =
    "https://t4.ftcdn.net/jpg/02/71/07/33/360_F_271073385_A6geLjwkrty3xkDPxaf7lcaEiNMtMwjN.jpg";
  const title = "Document Title";
  const description = "This is a description of the document";
  const tags = ["Tag 1", "Tag 2", "Tag 3"];

  return (
    <div className={styles.fileContainer}>
      <div className={styles.fileName}>{title}</div>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt="File Thumbnail" className={styles.thumbnail} />
        <div className={styles.overlay}>
          <span>File Preview</span>
        </div>
      </div>
      <div className={styles.fileDescription}>{description}</div>
      <div className={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <button key={index} className={styles.tagButton}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
