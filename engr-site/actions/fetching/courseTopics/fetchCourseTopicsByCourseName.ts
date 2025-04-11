"use server";
import { getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { lowercaseAndReplaceSpace } from "@/utils/formatting";
import { ModuleData } from "@/database/data/old/modules";
import { FetchedFormattedData } from "@/utils/types_v2";
import { CourseTopicData } from "@/database/data/courseTopics";

/**
 * Fetches course topics by course name from the database
 * @param courseName - The name of the course
 * @returns A promise that resolves to a FetchedFormattedData object
 * containing the fetched course topics or an error message
 */
export const fetchCourseTopicsByCourseName = async (
  courseName: string,
): Promise<FetchedFormattedData> => {
  try {
    const course = await getCourseByName(courseName);

    console.log(course?.id);

    if (!course?.id) {
      return {
        failure: "failed to get course Id",
        success: undefined,
      };
    }

    const query = `
      SELECT * FROM CourseTopics_v3 WHERE courseId = ?`;

    const { results } = await dbConnect(query, [course?.id]);

    if (results[0].length > 0) {
      const formattedData = results[0].map((item: CourseTopicData) => {
        const formatted = lowercaseAndReplaceSpace(
          item.id,
          item.courseTopicName,
        );
        return {
          id: item.id,
          name: formatted.name,
          url: formatted.url,
          // description: item.,
        };
      });

      return { success: formattedData, failure: undefined };
    }

    return { success: undefined, failure: "failed" };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
      success: undefined,
    };
  }
};
