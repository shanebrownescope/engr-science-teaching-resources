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
        <h2 className={styles.resultTitle}>{title}</h2>
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
