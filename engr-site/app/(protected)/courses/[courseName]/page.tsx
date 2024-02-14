import { fetchCoursesModules } from "@/actions/fetching/fetchCourseModules";
import Link from "next/link";

const CourseModules = async ({ params }: { params: {courseName: string} }) => {
  const modules = await fetchCoursesModules(params.courseName);

  console.log("== success: ", modules?.success)


  return (
    <div> 
      <p> { params.courseName } </p> 


      {modules?.success?.map((item: any, index: number) => (
        <div><Link href={`/courses/${params.courseName}/${item.formatted}`} key={index}> {item.original} </Link></div>
      ))}

      {modules?.failure && <p> here </p>}

    </div>
  )
}

export default CourseModules