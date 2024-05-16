"use server";
import { getCourseById, getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { ModuleData } from "@/database/data/old/modules";
import { FetchedFormattedData } from "@/utils/types";
import { CourseTopicData } from "@/database/data/courseTopics";

export const fetchCourseTopicsByCourseId = async (
  courseId: string | number
): Promise<FetchedFormattedData> => {
  console.log(courseId);
  try {
    const course = await getCourseById(courseId as string);
    console.log(course?.id);

    if (!course?.id) {
      return { failure: "failed to get course Id", success: undefined };
    }

    const query = `
      SELECT * FROM CourseTopics_v2 WHERE courseId = ?`;

    const { results } = await dbConnect(query, [course?.id]);
    console.log(results[0]);

    if (results[0].length > 0) {
      const formattedCourseTopicData: FormattedData[] = results[0].map((item: CourseTopicData) =>
        lowercaseAndReplaceSpace(item.id, item.courseTopicName)
      );
      console.log("fetchCourseTopics results: ", formattedCourseTopicData);
      return { success: formattedCourseTopicData, failure: undefined };
    }

    return { success: undefined, failure: "failed" };
  } catch (error) {
    console.error(error);
    return {
      failure: "Internal server error, error retrieving modules from db",
      success: undefined,
    };
  }
};
