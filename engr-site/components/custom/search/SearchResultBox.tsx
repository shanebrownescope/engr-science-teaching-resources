import React from "react";

import styles from "@/components/custom/search/SearchResultBox.module.css";
import Link from "next/link";
import { Rating } from "@mantine/core";

type SearchResultBoxProps = {
  type: string;
  id: number;
  title: string;
  urlName: string;
  uploadDate: string;
  description: string;
  tags: string[];
  courses: string[];
  courseTopics: string[];
  resourceType: string;
  contributor: string;
  avgRating: number | null;
  numReviews: number
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
  uploadDate,
  description,
  tags,
  courses,
  courseTopics,
  resourceType,
  contributor,
  avgRating,
  numReviews
}: SearchResultBoxProps) => {
  return (
    <div className={styles.resultBox}>
      <Link
        href={`/resources/${type}/${urlName}`}
      >
        <div className="resource-info-container">
          <p className={styles.resultDescription}>[{type}]</p>
          <p className={styles.resultDescription}> Uploaded on: {uploadDate} </p>
          <p className={styles.resultDescription}> Creator: {contributor}</p>
          <p className={styles.resultDescription}> Resource Type: {resourceType} </p>
          {avgRating ? (
            <div className="resource-rating-container">
              <p className={styles.resultDescription}>Average Rating: </p> 
              <Rating value={avgRating} fractions={2} readOnly />
              <p className={styles.resultDescription}>({numReviews})</p>
            </div>
          ) : <p className={styles.resultDescription}>No Reviews</p>}
        </div>
        <div className={styles.tagsContainer}>
          <p> Tags: </p>
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className={`${styles.tag} ${styles.tag.toLowerCase()}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.tagsContainer}>
          <p> Relevant Courses: </p>
          {courses.map((course: string, index: number) => (
            <span
              key={index}
              className={`${styles.tag} ${styles.tag.toLowerCase()}`}
            >
              {course}
            </span>
          ))}
        </div>
        <div className={styles.tagsContainer}>
          <p> Relevant Course Topics: </p>
          {courseTopics.map((courseTopic: string, index: number) => (
            <span
              key={index}
              className={`${styles.tag} ${styles.tag.toLowerCase()}`}
            >
              {courseTopic}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
};
