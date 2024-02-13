import React from "react";
import "./SimilarDocument.css"; // Assuming styles are defined in this CSS file

export const SimilarDocument = ({ imageUrl, title }) => {
  return (
    <div className="document-container">
      {/* <img src={imageUrl} alt={title} className="document-image" /> */}
      <div className="overlay">
        <p className="image-title">{title}</p>
      </div>
    </div>
  );
};
