"use server";
import { getModuleByNameAndId } from "@/database/data/modules";
import dbConnect from "@/database/dbConnector";
import { lowercaseAndReplaceSpace } from "@/utils/formatting";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import { SectionData } from "@/database/data/sections";

type fetchSectionByModuleProps = {
  id: string;
};

export const fetchSectionsByModule = async ({
  id,
}: fetchSectionByModuleProps): Promise<FetchedFormattedData> => {
  console.log(id);
  try {
    const query = `
      SELECT * FROM Sections WHERE ModuleId = ?`;

    const { results } = await dbConnect(query, [id]);
    console.log(results[0]);

    if (results[0].length > 0) {
      const formattedModuleData = results[0].map((item: SectionData) =>
        lowercaseAndReplaceSpace(item.SectionId, item.SectionName)
      );
      console.log("fetchmoduleModules results: ", formattedModuleData);
      return { success: formattedModuleData, failure: undefined };
    }

    return { failure: "failed", success: undefined };
  } catch (error) {
    // console.error(error);
    return {
      failure: "Internal server error, error retrieving modules from db",
      success: undefined,
    };
  }
};
