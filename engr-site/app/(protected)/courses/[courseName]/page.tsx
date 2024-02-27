import { fetchCoursesModules } from "@/actions/fetching/fetchCourseModules";
import Link from "next/link";
import { ModuleCard } from "@/components/mantine";

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
          <ModuleCard
            title={item.original}
            description="description here"
            href={`/courses/${params.courseName}/${item.formatted}`}
          />
        </div>
      ))}

      {modules?.failure && <p> here </p>}

      {/* <ModuleCard />
      <ModuleCard />
      <ModuleCard /> */}
    </div>
  );
};

export default CourseModules;
