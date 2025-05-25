import { FormattedData, capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types_v2";
import Link from "next/link";
import { CourseCard, ModuleCard } from "@/components/mantine";
import { fetchCourseTopicsByCourseName } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseName";
import requireAuth from "@/actions/auth/requireAuth";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import "./page.css";

const CourseTopicsPage = async ({
  params,
}: {
  params: { courseName: string };
}) => {
  await requireAuth();
  
  const courseNameFormatted = capitalizeAndReplaceDash(params.courseName);
  const courseTopicList: FetchedFormattedData = await fetchCourseTopicsByCourseName(courseNameFormatted);

  return (
    <ContainerLayout>
      <h2 className="text-center mb-4 heading-3"> {courseNameFormatted} </h2>

      <p className="label-primary h2-mb-md text-center label">
        {" "}
        Course topics{" "}
      </p>

      <div className="grid-container">
        {courseTopicList?.success?.map((item: FormattedData, index: number) => (
          <CourseCard
            key={index}
            title={item.name}
            href={`/search?q=${encodeURIComponent(item.name.trim())}`}
          />
        ))}
      </div>

      {courseTopicList?.failure && <p> No course topics </p>}
    </ContainerLayout>
  );
};

export default CourseTopicsPage;
