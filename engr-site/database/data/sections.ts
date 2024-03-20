import dbConnect from "@/database/dbConnector";

export type SectionData = {
  SectionId: number
  SectionName: string,
  ModuleId: number,
  S3Url?: string
}

export const getSectionById = async (id: string): Promise<SectionData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Sections WHERE SectionId = ?`

    const { results, error } = await dbConnect(selectQuery, [id])

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}

export const getSectionByNameAndModuleId = async (name: string, id: string): Promise<SectionData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Sections WHERE SectionName LIKE ? AND ModuleId = ?`

    const { results, error } = await dbConnect(selectQuery, [name, id])

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}

export const getSectionByIdAndModuleId = async (sectionId: string, moduleId: string): Promise<SectionData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Sections WHERE SectionId = ? AND ModuleId = ?`

    const { results, error } = await dbConnect(selectQuery, [sectionId, moduleId])

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}