import React from "react";
import "./Document.css"; // Make sure to create this CSS file in the same directory

export const Document = () => {
  const imageUrl =
    "https://t4.ftcdn.net/jpg/02/71/07/33/360_F_271073385_A6geLjwkrty3xkDPxaf7lcaEiNMtMwjN.jpg";
  const title = "Document Title";
  const description = "This is a description of the document";
  const tags = ["Tag 1", "Tag 2", "Tag 3"];

  return (
    <div className="file-container">
      <div className="file-name">{title}</div>
      <div className="image-container">
        <img src={imageUrl} alt="File Thumbnail" className="thumbnail" />
        <div className="overlay">
          <span>File Preview</span>
        </div>
      </div>
      <div className="file-description">{description}</div>
      <div className="tags-container">
        {tags.map((tag, index) => (
          <button key={index} className="tag-button">
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
