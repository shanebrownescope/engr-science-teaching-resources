import React from "react";

import styles from "@/components/custom/search/SearchResultBox.module.css";
import Link from "next/link";

type SearchResultBoxProps = {
  type: string;
  id: number;
  title: string;
  urlName: string;
  description: string;
  tags: string[];
};

/**
 * Renders a search result box.
 *
 * @param {SearchResultBoxProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SearchResultBox component.
 */
export const SearchResultBox = ({
  type,
  id,
  title,
  urlName,
  description,
  tags,
}: SearchResultBoxProps) => {
  console.log(tags);
  return (
    <div className={styles.resultBox}>
      <Link
        href={`/resources/${type}/${urlName}?${new URLSearchParams({
          id: id.toString(),
        })}`}
      >
        <h5 className={styles.resultTitle}>{title}</h5>
        <p className={styles.resultDescription}>{description}</p>
        <div className={styles.tagsContainer}>
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className={`${styles.tag} ${styles.tag.toLowerCase()}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
};
