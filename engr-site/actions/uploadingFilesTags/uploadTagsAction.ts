"use server"

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";

//* REF: () => createTagPost ln: 117
const getTagId = async(tagName: string) => {
  const query = `
    SELECT TagId FROM Tags WHERE TagName = ?`
  const { results: selectResults, error } = await dbConnect(query, [tagName]);

  if (error) {
    return {failure: "error in getting tag name in Tag"}
  }

  if (selectResults[0].length > 0) {
    //* Tag exists, return the existing TagId
    console.log("tag exists", selectResults[0][0])
    return { tagId: selectResults[0][0].TagId };

  } else {
    //* Tag doesn't exist, insert it and return the new TagId
    const queryInsert = `
      INSERT INTO Tags (TagName) VALUES (?)`
    const { results: insertResult, error: insertError } = await dbConnect(queryInsert, [tagName]);
    
    if (insertError) {
      return {failure: "error inserting tag name in Tag"}
    }
    console.log("tag doesn't exists")
    return { tagId: insertResult[0].insertId };
  }
}

//* inserts tags for file
export const createTagPost = async (tags: string[], fileId: number) => {
  //* first check if user is logged before request
  const user = await getCurrentUser()
  console.log("parameters: ", tags, fileId, user?.id)
  if (user?.role && user?.role !== "admin") {
    return { failure: "Not authenticated" }
  }

  //* check if fileId is created in db
  if (fileId) {
    const queryFileExists = `
      SELECT * FROM Files WHERE FileId = ? AND UploadedUserId = ?`
    const valuesFileExists = [fileId, user?.id]
    try {
      const { results: fileResults, error } = await dbConnect(queryFileExists, valuesFileExists)

      if (error) {
        return { failure: "error in checking file is in Files"}
      }

      if (fileResults[0][0].FileId != fileId) {
        console.error("Media not found")
        return { failure: "Media not found createTagPost"}
      }

      //* insert tags
      for (const tagName of tags) {
        const tagResponse = await getTagId(tagName);

        if (tagResponse.failure) {
          return {failure: "failed in getTagId() "}
        }
  
        const tagId = tagResponse.tagId 
      
        // Linking tags to the file
        const queryInsert = `
          INSERT INTO FileTags (FileId, TagId) VALUES (?, ?)`
        const valuesInsert = [fileId, tagId]
        await dbConnect(queryInsert, valuesInsert);
      }
      return { success: "Tags and FileTags inserted successful"}
      
    } catch (error) {
      console.error("Internal server error in createTagPost()")
      return { failure: "Internal server error in createTagPost()"}
    }
  }
}