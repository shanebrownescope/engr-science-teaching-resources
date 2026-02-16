import { LinkData } from "@/utils/types";
import dbConnect from "../dbConnector";

export const getLinkById = async (id: string): Promise<LinkData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Links_v3 WHERE id = ?`;

    const { results: link, error } = await dbConnect(selectQuery, [id]);

    if (link[0].length === 0) {
      return null;
    }
    return link[0][0];
  } catch (error) {
    return null;
  }
};
