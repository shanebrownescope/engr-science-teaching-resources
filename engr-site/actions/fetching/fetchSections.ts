"use server"
import { getModuleByName } from "@/database/data/modules"
import dbConnect from "@/database/dbConnector"
import { lowercaseAndReplaceSpace } from "@/utils/formatting"

export const fetchSections = async(module: string) => {
  try {
    const module = await getModuleByName(module)
    console.log(module?.ModuleId)

    if (!module?.ModuleId) {
      return { failure: "failed to get module Id"}
    }


    const query = `
      SELECT * FROM Modules WHERE ModuleId = ?`
  
    const { results } = await dbConnect(query, [module?.ModuleId]);
    console.log(results[0])

    if (results[0].length > 0) {
      const firstObject = results[0][0];
      const formattedModuleData = lowercaseAndReplaceSpace(results[0], Object.keys(firstObject)[1], Object.keys(firstObject)[0])
      console.log("fetchmoduleModules results: ", formattedModuleData)
      return { success: formattedModuleData }
    }

    return { failure: "failed"}

  } catch (error) {
    console.error(error);
    return { failure: "Internal server error, error retrieving modules from db" }
  }

}