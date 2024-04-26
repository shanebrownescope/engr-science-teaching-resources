import dbConnect from "@/database/dbConnector";

export type CourseData = {
  id: string,
  courseName: string,
}

export const getCourseByName = async (name: string): Promise<CourseData | null> => {
  console.log(name)
  try {
    const selectQuery = `
      SELECT * FROM Courses_v2 WHERE courseName LIKE ?`

    const { results, error } = await dbConnect(selectQuery, [name])

    console.log(results)

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}


export const getCourseById = async (id: string): Promise<CourseData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Courses_v2 WHERE id = ?`

    const { results: course, error } = await dbConnect(selectQuery, [id])

    if (course[0].length > 0) {
      return course[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}

export const getAllCourses = async(): Promise<CourseData[] | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Courses_v2`

    const { results, error } = await dbConnect(selectQuery)

    console.log(results[0])

    if (results[0].length > 0) {
      return results[0]
    }

    return null
  } catch (error) {
    return null
  }
}