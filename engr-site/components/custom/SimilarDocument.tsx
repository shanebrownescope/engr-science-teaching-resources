import React from "react";
import "./SimilarDocument.css"; // Assuming styles are defined in this CSS file

export const SimilarDocument = ({}) => {
  const imageUrl =
    "https://t4.ftcdn.net/jpg/02/71/07/33/360_F_271073385_A6geLjwkrty3xkDPxaf7lcaEiNMtMwjN.jpg";
  const title = "Document Title";

  return (
    <div className="document-container">
      <img src={imageUrl} alt={title} className="document-image" />
      <div className="overlay">
        <p className="image-title">{"hello"}</p>
      </div>
    </div>
  );
};
