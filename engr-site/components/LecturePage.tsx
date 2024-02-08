import React from "react";
import { HeaderMegaMenu, Comment } from "./mantine";

export const LecturePage = () => {
  return (
    <div>
      <HeaderMegaMenu />
      <h1>Comments</h1>
      <Comment />
      <Comment />
    </div>
  );
};
