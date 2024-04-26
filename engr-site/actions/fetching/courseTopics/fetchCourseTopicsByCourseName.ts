"use server";
import { getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { lowercaseAndReplaceSpace } from "@/utils/formatting";
import { ModuleData } from "@/database/data/old/modules";
import { FetchedFormattedData } from "@/utils/types";
import { CourseTopicData } from "@/database/data/courseTopics";

export const fetchCourseTopicsByCourseName = async (
  courseName: string
): Promise<FetchedFormattedData> => {
  console.log(courseName);
  try {
    const course = await getCourseByName(courseName);
    console.log(course?.id);

    if (!course?.id) {
      return { failure: "failed to get course Id", success: undefined };
    }

    const query = `
      SELECT * FROM CourseTopics_v2 WHERE courseId = ?`;

    const { results } = await dbConnect(query, [course?.id]);
    console.log(results[0]);

    if (results[0].length > 0) {
      const formattedData = results[0].map((item: CourseTopicData) =>
        lowercaseAndReplaceSpace(item.id, item.courseTopicName)
      );
      console.log("formattedData results: ", formattedData);
      return { success: formattedData, failure: undefined };
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
