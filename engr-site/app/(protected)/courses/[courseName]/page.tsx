import { fetchCoursesModules } from "@/actions/fetching/fetchCourseModules";
import Link from "next/link";

const CourseModules = async ({
  params,
}: {
  params: { courseName: string };
}) => {
  const modules = await fetchCoursesModules(params.courseName);

  console.log("== success: ", modules?.success);

  return (
    <div>
      <p> {params.courseName} </p>

      {modules?.success?.map((item: any, index: number) => (
        <div>
          <Link
            href={`/courses/${params.courseName}/${item.formatted}`}
            key={index}
          >
            {" "}
            {item.original}{" "}
          </Link>
        </div>
      ))}

      {modules?.failure && <p> here </p>}
    </div>
  );
};

export default CourseModules;

// "use client";
// import React from "react";
// import "@mantine/core/styles.css";
// import { createTheme, MantineProvider } from "@mantine/core";
// import { HeaderMegaMenu, CourseCard } from "../../../components/mantine";
// import { useParams } from "next/navigation";

// export default function Course() {
//   const params = useParams<{ coursename: string }>();

//   return (
//     <MantineProvider>
//       <HeaderMegaMenu />
//       <h1>Course: {params.coursename}</h1>
//       <CourseCard />
//       <CourseCard />
//       <CourseCard />
//     </MantineProvider>
//   );
// }
