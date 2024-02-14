import dbConnect from "@/database/dbConnector";

export type CourseData = {
  CourseId: number,
  CourseName: string,
}

export const getCourseByName = async (name: string): Promise<CourseData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Courses WHERE CourseName = ?`

    const { results: course, error } = await dbConnect(selectQuery, [name])

    if (course[0].length > 0) {
      return course[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}


export const getCourseById = async (id: string): Promise<CourseData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Courses WHERE CourseId = ?`

    const { results: course, error } = await dbConnect(selectQuery, [id])

    if (course[0].length > 0) {
      return course[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}