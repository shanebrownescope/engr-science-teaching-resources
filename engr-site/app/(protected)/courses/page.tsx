import Link from "next/link";
import { FetchedFormattedData } from "@/utils/types";
import { CourseCard } from "@/components/mantine";
import "./page.css";
import { FormattedData } from "@/utils/formatting";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import requireAuth from "@/actions/auth/requireAuth";
import SectionLayout from "@/components/custom/sectionLayout/SectionLayout";

const Courses = async () => {
  const authResult = await requireAuth();

  const courseData: FetchedFormattedData = await fetchCourses();


  console.log("--courseData: ", courseData);

  return (
    <SectionLayout> 
      <h2>Courses</h2>

      <div className="grid-container">
        {courseData?.success?.map((item: FormattedData) => (
          <CourseCard
            title={item.name}
            description="description here"
            href={`/courses/${item.url}`}
          />
        ))}
      </div>

      {courseData?.failure && <div>No courses</div>}
    </SectionLayout>
  );
};

export default Courses;
