import React from "react";
import { HeaderMegaMenu, Comment } from "./mantine";
import { SimilarDocument } from "./custom";

export const LecturePage = () => {
  return (
    <div>
      <HeaderMegaMenu />
      <SimilarDocument />
      <h1>Comments</h1>
      <Comment />
      <Comment />
    </div>
  );
};
