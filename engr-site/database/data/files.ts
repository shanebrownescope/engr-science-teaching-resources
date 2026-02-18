import { FileData } from "@/utils/types";
import dbConnect from "../dbConnector";

export const getFileById = async (id: string): Promise<FileData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Files_v3 WHERE id = ?`;

    const { results: file, error } = await dbConnect(selectQuery, [id]);

    if (file[0].length === 0) {
      return null;
    }
    return file[0][0];
  } catch (error) {
    return null;
  }
};
