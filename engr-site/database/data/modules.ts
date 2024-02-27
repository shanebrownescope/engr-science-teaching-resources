import dbConnect from "@/database/dbConnector";

export type ModuleData = {
  ModuleId: number,
  ModuleName: string,
  CourseId: number
}

export const getModuleByNameAndId = async(name: string, id: string | null) => {
  console.log(name, id)
  try {
    const selectQuery = `
      SELECT * FROM Modules WHERE ModuleName = ? AND ModuleId = ?`

    const { results, error } = await dbConnect(selectQuery, [name, id])
    console.log(results[0])

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}

export const getModuleByName = async (name: string): Promise<ModuleData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Modules WHERE ModuleName = ?`

    const { results, error } = await dbConnect(selectQuery, [name])

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}


export const getModuleById = async (id: string): Promise<ModuleData | null> => {
  try {
    const selectQuery = `
      SELECT * FROM Modules WHERE ModuleId = ?`

    const { results, error } = await dbConnect(selectQuery, [id])

    if (results[0].length > 0) {
      return results[0][0]
    }

    return null
  } catch (error) {
    return null
  }
}