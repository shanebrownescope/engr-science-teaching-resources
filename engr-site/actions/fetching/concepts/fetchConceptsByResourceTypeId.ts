"use server";
import { ConceptData } from "@/database/data/concepts";
import dbConnect from "@/database/dbConnector";
import { FormattedData, lowercaseAndReplaceSpace } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";


export const fetchConceptsByResourceTypeId = async (id: string | number): Promise<FetchedFormattedData> => {
  try {
    const selectQuery = `
      SELECT * FROM Concepts_v2 WHERE resourceTypeId = ?`;

    const { results, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (results[0].length > 0) {
      const formattedConceptData: FormattedData[] = results[0].map(
        (concept: ConceptData) =>
          lowercaseAndReplaceSpace(concept.id, concept.conceptName)
      );
      console.log("formattedConceptData results: ", formattedConceptData);
      return { success: formattedConceptData, failure: undefined };
    }

    if (results[0].length === 0) {
      return { success: undefined, failure: "No concepts found" };
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
