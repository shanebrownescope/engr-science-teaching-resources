import { fetchCourses } from "@/actions/fetching/fetchCourses";
import Link from "next/link";
import { fetchedFormattedData } from "@/utils/types";

const Courses = async () => {
  const courseData: fetchedFormattedData = await fetchCourses();

  if (courseData?.failure) {
    console.log("bad stuff");
  }

  console.log("--courseData: ", courseData);

  return (
    <div>
      <p>Courses</p>

      {courseData?.success?.map((item: any) => (
        <p key={item.formatted}>
          <Link href={`/courses/${item.formatted}`}>{item.original} </Link>
        </p>
      ))}

      {courseData?.failure && <div>No courses</div>}
    </div>
  );
};

export default Courses;
