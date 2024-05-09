import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import Link from "next/link";
import { ModuleCard } from "@/components/mantine";
import { fetchCourseTopicsByCourseName } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseName";
import "./page.css";

const CourseTopicsPage = async ({
  params,
}: {
  params: { courseName: string };
}) => {
  const courseTopicName = capitalizeAndReplaceDash(params.courseName);
  const courseTopicList: FetchedFormattedData =
    await fetchCourseTopicsByCourseName(courseTopicName);
  console.log(params.courseName);

  console.log("== success: ", courseTopicList.success);

  return (
    <div>
      <p className="course-topic-name">{courseTopicName}</p>

      {courseTopicList?.success?.map((item: any, index: number) => (
        <div>
          <ModuleCard
            title={item.name}
            description="description here"
            href={`/courses/${params.courseName}/${
              item.url
            }?${new URLSearchParams({
              id: item.id,
            })}`}
          />
        </div>
      ))}

      {courseTopicList?.failure && <p> No course topics </p>}
    </div>
  );
};

export default CourseTopicsPage;
