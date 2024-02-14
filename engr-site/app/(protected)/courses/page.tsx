import { fetchCourses } from "@/actions/fetching/fetchCourses"

const Courses = async () => {
  const courseData = await fetchCourses()
  
  if (courseData?.failure) {
    console.log("bad stuff")
  }

  console.log("--courseData: ", courseData)

  return (
    <div>
      <p>Courses</p>

      {courseData?.success?.map(item => (
        <p key={item.formatted}> {item.original} </p>
      ))}


    </div>
  )
}

export default Courses