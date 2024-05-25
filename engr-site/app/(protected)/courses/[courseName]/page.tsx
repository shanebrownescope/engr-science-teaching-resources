import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import Link from "next/link";
import { ModuleCard } from "@/components/mantine";
import { fetchCourseTopicsByCourseName } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseName";
import requireAuth from "@/actions/auth/requireAuth";
import SectionLayout from "@/components/custom/sectionLayout/SectionLayout";
import "./page.css";

const CourseTopicsPage = async ({
  params,
}: {
  params: { courseName: string };
}) => {
  const authResult = await requireAuth();
  const courseTopicName = capitalizeAndReplaceDash(params.courseName);
  const courseTopicList: FetchedFormattedData =
    await fetchCourseTopicsByCourseName(courseTopicName);
  console.log(params.courseName);

  console.log("== success: ", courseTopicList.success);

  return (
    <SectionLayout>
      <h2> {courseTopicName} </h2>

      <label className="label-primary"> Course topics </label>

      {courseTopicList?.success?.map((item: any, index: number) => (
        <div>
          <ModuleCard
            title={item.name}
            description="description here"
            href={`/courses/${params.courseName}/${item.url}?${new URLSearchParams(
              {
                id: item.id,
              },
            ).toString()}`}
          />
        </div>
      ))}

      {courseTopicList?.failure && <p> No course topics </p>}
    </SectionLayout>
  );
};

export default CourseTopicsPage;
