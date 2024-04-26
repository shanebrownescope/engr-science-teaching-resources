import { fetchModulesByCourse } from "@/actions/fetching/fetchModulesByCourse";
import { FormattedData, capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import Link from "next/link";
import { ModuleCard } from "@/components/mantine";
import { fetchCourseTopicsByCourseName } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseName";

const CourseTopicsPage = async ({
  params,
}: {
  params: { courseName: string };
}) => {
  const courseTopicName = capitalizeAndReplaceDash(params.courseName);
  const modules: FetchedFormattedData = await fetchCourseTopicsByCourseName(courseTopicName);
  console.log(params.courseName);

  console.log("== success: ", modules.success);

  return (
    <div>
      <p> {courseTopicName} </p>

      {modules?.success?.map((item: any, index: number) => (
        <div>
          <ModuleCard
            title={item.name}
            description="description here"
            href={`/courses/${params.courseName}/${item.url}`}
          />

          <Link
            href={`/courses/${params.courseName}/${
              item.url
            }?${new URLSearchParams({
              id: item.id,
            })}`}
            key={index}
          >
            {" "}
            {item.name}{" "}
          </Link>
        </div>
      ))}

      {modules?.failure && <p> No course topics </p>}
    </div>
  );
};

export default CourseTopicsPage;
