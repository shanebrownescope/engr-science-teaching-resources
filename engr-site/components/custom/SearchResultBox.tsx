import React from "react";
import "./SearchResultBox.css"; // Make sure this path matches the location of your CSS file
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
    <div className="resultBox">
      <Link
        href={`/resources/${type}/${urlName}?${new URLSearchParams({
          id: id.toString()
        })}`}
      >
        <h2 className="resultTitle">{title}</h2>
        <p className="resultDescription">{description}</p>
        <div className="tagsContainer">
          {tags.map((tag: string, index: number) => (
            <span key={index} className={`tag ${tag.toLowerCase()}`}>
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
};
