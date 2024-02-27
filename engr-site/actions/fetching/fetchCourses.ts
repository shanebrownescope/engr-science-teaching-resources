"use server";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { CourseData } from "@/database/data/courses";
import { fetchedFormattedData } from "@/utils/types";

export const fetchCourses = async (): Promise<fetchedFormattedData> => {
  try {
    const query = `SELECT * FROM Courses`;

    const { results, error } = await dbConnect(query);

    if (results[0].length > 0) {
      const formattedCourseData: FormattedData[] = results[0].map(
        (item: CourseData) =>
          lowercaseAndReplaceSpace(item.CourseId, item.CourseName)
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
