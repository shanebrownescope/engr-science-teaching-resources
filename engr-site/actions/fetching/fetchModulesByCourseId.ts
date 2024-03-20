"use server";
import { getCourseById, getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import { lowercaseAndReplaceSpace } from "@/utils/formatting";
import { ModuleData } from "@/database/data/modules";
import { FetchedFormattedData } from "@/utils/types";

export const fetchModulesByCourseId = async (
  courseId: string
): Promise<FetchedFormattedData> => {
  console.log(courseId);
  try {
    const course = await getCourseById(courseId);
    console.log(course?.CourseId);

    if (!course?.CourseId) {
      return { failure: "failed to get course Id", success: undefined };
    }

    const query = `
      SELECT * FROM Modules WHERE CourseId = ?`;

    const { results } = await dbConnect(query, [course?.CourseId]);
    console.log(results[0]);

    if (results[0].length > 0) {
      const formattedModuleData = results[0].map((item: ModuleData) =>
        lowercaseAndReplaceSpace(item.ModuleId, item.ModuleName)
      );
      console.log("fetchCourseModules results: ", formattedModuleData);
      return { success: formattedModuleData, failure: undefined };
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
