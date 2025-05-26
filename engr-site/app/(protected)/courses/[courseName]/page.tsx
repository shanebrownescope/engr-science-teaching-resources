import { FormattedData, capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import Link from "next/link";
import { ModuleCard } from "@/components/mantine";
import { fetchCourseTopicsByCourseName } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseName";
import requireAuth from "@/actions/auth/requireAuth";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
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
    <ContainerLayout>
      <h2 className="text-center mb-4 heading-3"> {courseTopicName} </h2>

      <p className="label-primary h2-mb-md text-center label">
        {" "}
        Course topics{" "}
      </p>

      <div className="flex-col gap-1">
        {courseTopicList?.success?.map((item: FormattedData, index: number) => (
          <ModuleCard
            title={item.name}
            description=""
            href={`/courses/${params.courseName}/${item.url}?${new URLSearchParams(
              {
                id: item.id.toString(),
              },
            ).toString()}`}
          />
        ))}
      </div>

      {courseTopicList?.failure && <p> No course topics </p>}
    </ContainerLayout>
  );
};

export default CourseTopicsPage;
