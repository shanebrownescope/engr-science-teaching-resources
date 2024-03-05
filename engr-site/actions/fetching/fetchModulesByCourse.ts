"use server";
import { getCourseByName } from "@/database/data/courses";
import dbConnect from "@/database/dbConnector";
import {
  lowercaseAndReplaceSpace,
} from "@/utils/formatting";
import { ModuleData } from "@/database/data/modules";
import { fetchedFormattedData } from "@/utils/types";

export const fetchModulesByCourse = async (
  courseName: string
): Promise<fetchedFormattedData> => {
  console.log(courseName);
  try {
    const course = await getCourseByName(courseName);
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
