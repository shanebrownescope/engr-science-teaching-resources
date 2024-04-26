"use server";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { CourseData } from "@/database/data/courses";
import { FetchedFormattedData } from "@/utils/types";

export const fetchCourses = async (): Promise<FetchedFormattedData> => {
  try {
    const query = `SELECT * FROM Courses_v2`;

    const { results, error } = await dbConnect(query);

    if (results[0].length > 0) {
      const formattedCourseData: FormattedData[] = results[0].map(
        (item: CourseData) =>
          lowercaseAndReplaceSpace(item.id, item.courseName)
      );
      console.log(formattedCourseData);
      return { success: formattedCourseData, failure: undefined };
    }
  } catch (error) {
    console.error(error);
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
