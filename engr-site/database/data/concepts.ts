import dbConnect from "@/database/dbConnector";

export type ConceptData = {
  id: number,
  conceptName: string,
}

export const getConceptByNameAndResourceTypeId = async (name: string, id: string): Promise<ConceptData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Concepts_v2 WHERE conceptName = ? AND resourceTypeId = ?`

    const { results, error } = await dbConnect(selectQuery, [name, id])

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}