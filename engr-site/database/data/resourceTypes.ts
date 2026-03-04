import dbConnect from "@/database/dbConnector";

export type ResourceTypeData = {
  id: number | string;
  resourceTypeName: string;
  courseTopicId: number | string;
};

export const getResourceTypeById = async (
  id: string,
): Promise<ResourceTypeData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM ResourceTypes_v2 WHERE id = ?`;

    const { results, error } = await dbConnect(selectQuery, [id]);

    if (results[0].length > 0) {
      return results[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getResourceTypeByNameAndCourseTopicId = async (
  name: string,
  id: string,
): Promise<ResourceTypeData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM ResourceTypes_v2 WHERE resourceTypeName LIKE ? AND courseTopicId = ?`;

    const { results, error } = await dbConnect(selectQuery, [name, id]);

    if (results[0].length > 0) {
      return results[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getResourceTypeByIdAndCourseTopicId = async (
  resourceTypeId: string,
  courseTopicId: string,
): Promise<ResourceTypeData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM ResourceTypes_v2 WHERE id = ? AND courseTopicId = ?`;

    const { results, error } = await dbConnect(selectQuery, [
      resourceTypeId,
      courseTopicId,
    ]);

    if (results[0].length > 0) {
      return results[0][0];
    }

    return null;
  } catch (error) {
    return null;
  }
};
