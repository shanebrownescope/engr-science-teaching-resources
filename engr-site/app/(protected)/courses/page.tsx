import { fetchCourses } from "@/actions/fetching/fetchCourses";
import Link from "next/link";
import { FetchedFormattedData } from "@/utils/types";
import { CourseCard } from "@/components/mantine";
import "./page.css";

const Courses = async () => {
  const courseData: FetchedFormattedData = await fetchCourses();

  if (courseData?.failure) {
    console.log("bad stuff");
  }

  console.log("--courseData: ", courseData);

  return (
    <div>
      <p>Courses</p>

      <div className="grid-container">
        {courseData?.success?.map((item: any) => (
          <CourseCard
            title={item.original}
            description="description here"
            href={`/courses/${item.formatted}`}
          />
        ))}
      </div>

      {courseData?.failure && <div>No courses</div>}
    </div>
  );
};

export default Courses;
