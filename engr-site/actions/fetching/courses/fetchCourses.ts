"use server";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { CourseData } from "@/database/data/courses";
import { FetchedFormattedData } from "@/utils/types";

type FetchCoursesProps = {
  limit?: number;
};

/**
 * Fetches courses from the database.
 *
 * @param {number | undefined} limit - The maximum number of courses to fetch. Pass undefined to fetch all courses or pass a number to fetch a specific number of courses.
 * @return {Promise<FetchedFormattedData>} A promise that resolves to a FetchedFormattedData object containing the fetched courses or an error message.
 */
export const fetchCourses = async (
  limit?: number,
): Promise<FetchedFormattedData> => {
  try {
    let query = `SELECT * FROM Courses_v2`;

    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }

    const { results, error } = await dbConnect(query);

    if (results[0].length > 0) {
      const formattedCourseData: FormattedData[] = results[0].map(
        (item: CourseData) =>
          lowercaseAndReplaceSpace(item.id, item.courseName),
      );

      return { success: formattedCourseData, failure: undefined };
    }
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving courses from db",
      success: undefined,
    };
  }
  return {
    failure: "Internal server error, error retrieving courses from db",
    success: undefined,
  };
};
