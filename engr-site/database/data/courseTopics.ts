import dbConnect from "@/database/dbConnector";

export type CourseTopicData = {
  id: number;
  courseTopicName: string;
  courseId: number;
};

export const getCourseTopicByNameAndId = async (
  name: string,
  id: string | null,
) => {
  console.log(name, id);
  try {
    const selectQuery = `
      SELECT * FROM CourseTopics_v3 WHERE courseTopicName = ? AND id = ?`;

    const { results, error } = await dbConnect(selectQuery, [name, id]);
    console.log(results[0]);

    if (results[0].length > 0) {
      return results[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getCourseTopicByName = async (
  name: string,
): Promise<CourseTopicData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM CourseTopics_v3 WHERE courseTopicName = ?`;

    const { results, error } = await dbConnect(selectQuery, [name]);

    if (results[0].length > 0) {
      return results[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getCourseTopicById = async (
  id: string,
): Promise<CourseTopicData | null> => {
  console.log(id);
  try {
    const selectQuery = `
      SELECT * FROM CourseTopics_v3 WHERE id = ?`;

    const { results, error } = await dbConnect(selectQuery, [id]);

    if (results[0].length > 0) {
      return results[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getCourseTopicByIdAndCourseId = async (
  courseTopicId: string,
  courseId: string | null,
) => {
  console.log(courseTopicId, courseId);
  try {
    const selectQuery = `
      SELECT * FROM CourseTopics_v3 WHERE id = ? AND courseId = ?`;

    const { results, error } = await dbConnect(selectQuery, [
      courseTopicId,
      courseId,
    ]);
    console.log(results[0]);

    if (results[0].length > 0) {
      return results[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};
