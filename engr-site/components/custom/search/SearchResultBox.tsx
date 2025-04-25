import React from "react";

import styles from "@/components/custom/search/SearchResultBox.module.css";
import Link from "next/link";
import { Rating } from "@mantine/core";
import { ResourceCard } from "@/components/mantine/ResourceCard";

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
    <ResourceCard 
      type={type}
      title={title}
      urlName={urlName}
      uploadDate={uploadDate}
      description={description}
      tags={tags}
      courses={courses}
      courseTopics={courseTopics}
      resourceType={resourceType}
      contributor={contributor}
      avgRating={avgRating}
      numReviews={numReviews}
    />
  );
};
