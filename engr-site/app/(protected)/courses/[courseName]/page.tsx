import { fetchModulesByCourse } from "@/actions/fetching/fetchModulesByCourse";
import { FormattedData, capitalizeAndReplaceDash } from "@/utils/formatting";
import { fetchedFormattedData } from "@/utils/types";
import Link from "next/link";

const CourseModules = async ({
  params,
}: {
  params: { courseName: string };
}) => {
  const moduleName = capitalizeAndReplaceDash(params.courseName);
  const modules: fetchedFormattedData = await fetchModulesByCourse(moduleName);
  console.log(params.courseName);

  console.log("== success: ", modules.success);

  return (
    <div>
      <p> {moduleName} </p>

      {modules?.success?.map((item: any, index: number) => (
        <div>
          <Link
            href={`/courses/${params.courseName}/${
              item.formatted
            }?${new URLSearchParams({
              id: item.id,
            })}`}
            key={index}
          >
            {" "}
            {item.original}{" "}
          </Link>
        </div>
      ))}

      {modules?.failure && <p> No modules </p>}
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
