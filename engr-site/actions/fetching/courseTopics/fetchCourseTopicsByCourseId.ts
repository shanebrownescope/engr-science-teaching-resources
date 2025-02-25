"use server";
import { getCourseById, getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import { CourseTopicData } from "@/database/data/courseTopics";

/**
 * Fetches course topics by course id from the database
 * @param courseId - The id of the course
 * @returns A promise that resolves to a FetchedFormattedData object
 * containing the fetched course topics or an error message
 */
export const fetchCourseTopicsByCourseId = async (
  courseId: string | number,
): Promise<FetchedFormattedData> => {
  try {
    const course = await getCourseById(courseId as string);

    if (!course?.id) {
      return { failure: "failed to get course Id", success: undefined };
    }

    const query = `
      SELECT * FROM CourseTopics_v3 WHERE courseId = ?`;

    const { results } = await dbConnect(query, [course?.id]);

    if (results[0].length > 0) {
      const formattedCourseTopicData: FormattedData[] = results[0].map(
        (item: CourseTopicData) =>
          lowercaseAndReplaceSpace(item.id, item.courseTopicName),
      );
      return { success: formattedCourseTopicData, failure: undefined };
    }

    return { success: undefined, failure: "failed" };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
      success: undefined,
    };
  }
};
