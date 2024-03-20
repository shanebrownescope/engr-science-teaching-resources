"use server";
import { ConceptData } from "@/database/data/concepts";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";

type fetchConceptsBySectionIdProps = {
  id: number;
};

export const fetchConceptsBySectionId = async ({
  id,
}: fetchConceptsBySectionIdProps): Promise<FetchedFormattedData> => {
  try {
    const selectQuery = `
    SELECT * FROM Concepts WHERE SectionId = ?`;

    const { results, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (results[0].length > 0) {
      const formattedModuleData: FormattedData[] = results[0].map(
        (concept: ConceptData) =>
          lowercaseAndReplaceSpace(concept.ConceptId, concept.ConceptName)
      );
      console.log("fetchCourseModules results: ", formattedModuleData);
      return { success: formattedModuleData, failure: undefined };
    }

    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
