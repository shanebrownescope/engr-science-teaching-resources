import Link from "next/link";
import { FetchedFormattedData } from "@/utils/types";
import { CourseCard } from "@/components/mantine";
import "./page.css";
import { FormattedData } from "@/utils/formatting";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import requireAuth from "@/actions/auth/requireAuth";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";

const Courses = async () => {
  const authResult = await requireAuth();

  const courseData: FetchedFormattedData = await fetchCourses();

  console.log("--courseData: ", courseData);

  return (
    <ContainerLayout>
      <h2 className="text-center h2-mb-md heading-3">Courses</h2>

      <div className="grid-container">
        {courseData?.success?.map((item: FormattedData) => (
          <CourseCard
            title={item.name}
            description="description here"
            href={`/courses/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
          />
        ))}
      </div>

      {courseData?.failure && <div>No courses</div>}
    </ContainerLayout>
  );
};

export default Courses;
