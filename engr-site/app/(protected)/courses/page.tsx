import { fetchCourses } from "@/actions/fetching/fetchCourses";
import Link from "next/link";
import { FetchedFormattedData } from "@/utils/types";
import { ModuleCard } from "@/components/mantine";

const Courses = async () => {
  const courseData: FetchedFormattedData = await fetchCourses();

  if (courseData?.failure) {
    console.log("bad stuff");
  }

  console.log("--courseData: ", courseData);

  return (
    <div>
      <p>Courses</p>

      {courseData?.success?.map((item: any) => (
        <ModuleCard
          title={item.original}
          description="description here"
          href={`/courses/${item.formatted}`}
        />
      ))}

      {courseData?.failure && <div>No courses</div>}
    </div>
  );
};

export default Courses;
