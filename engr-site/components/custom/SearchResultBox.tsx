import React from "react";
import "./SearchResultBox.css"; // Make sure this path matches the location of your CSS file

export const SearchResultBox = ({ title, description, tags }) => {
  return (
    <div className="resultBox">
      <h2 className="resultTitle">{title}</h2>
      <p className="resultDescription">{description}</p>
      <div className="tagsContainer">
        {tags.map((tag, index) => (
          <span key={index} className={`tag ${tag.toLowerCase()}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
