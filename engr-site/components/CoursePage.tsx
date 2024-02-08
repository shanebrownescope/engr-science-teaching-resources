import React from "react";
import { HeaderMegaMenu, CourseCard } from "./mantine";

export const CoursePage = () => {
  // let { title } = useParams();
  return (
    <div>
      <HeaderMegaMenu />
      {/* <div>Course: {title}</div> */}
      <CourseCard />
    </div>
  );
};
