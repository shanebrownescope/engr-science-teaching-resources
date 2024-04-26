"use server"

import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";

//* REF: () => createTagPost ln: 117
const getTagId = async(tagName: string) => {
  const query = `
    SELECT * FROM Tags_v2 WHERE tagName = ?`
  const { results: selectResults, error } = await dbConnect(query, [tagName]);

  if (error) {
    return {failure: "error in getting tag name in Tag"}
  }

  if (selectResults[0].length > 0) {
    //* Tag exists, return the existing TagId
    console.log("tag exists", selectResults[0][0])
    return { tagId: selectResults[0][0].id };

  } else {
    //* Tag doesn't exist, insert it and return the new TagId
    const queryInsert = `
      INSERT INTO Tags_v2 (tagName) VALUES (?)`
    const { results: insertResult, error: insertError } = await dbConnect(queryInsert, [tagName]);
    
    if (insertError) {
      return {failure: "error inserting tag name in Tag"}
    }
    console.log("tag doesn't exists, insertedId", insertResult[0].insertId)
    return { tagId: insertResult[0].insertId };
  }
}

//* inserts tags for file
export const createTagPostFile = async (tags: string[], fileId: number) => {
  //* first check if user is logged before request
  const user = await getCurrentUser()
  console.log("parameters: ", tags, fileId, user?.id)
  if (user?.role && user?.role !== "admin") {
    return { failure: "Not authenticated" }
  }

  //* check if fileId is created in db
  if (fileId) {
    const queryFileExists = `
      SELECT * FROM Files_v2 WHERE id = ? AND uploadedUserId = ?`
    const valuesFileExists = [fileId, user?.id]
    try {
      const { results: fileExistsResults, error } = await dbConnect(queryFileExists, valuesFileExists)

      if (error) {
        return { failure: "error in checking file is in Files"}
      }
      console.log("fileId: ", fileId)
      console.log("fileExistsResults[0][0].id: ", fileExistsResults[0][0].id)

      if (fileExistsResults[0][0].id != fileId) {
        console.error("Media not found")
        return { failure: "Media not found createTagPost"}
      }

      //* insert tags
      for (const tagName of tags) {
        const tagResponse = await getTagId(tagName);

        if (tagResponse.failure) {
          return { failure: "failed in getTagId() " }
        }

        console.log("found or created tagId: ", tagResponse.tagId)
  
        const tagId = tagResponse.tagId 
      
        // Linking tags to the file
        const queryInsert = `
          INSERT INTO FileTags_v2 (fileId, tagId) VALUES (?, ?)`
        const valuesInsert = [fileId, tagId]
        const { results: fileTagsResult, error: insertError } = await dbConnect(queryInsert, valuesInsert);
        console.log("fileTagsResult: ", fileTagsResult[0].insertId)
      }
      return { success: "Tags and FileTags inserted successful"}
      
    } catch (error) {
      console.error("Internal server error in createTagPost()")
      return { failure: "Internal server error in createTagPost()"}
    }
  }
}


//* inserts tags for file
export const createTagPostLink = async (tags: string[], linkId: number) => {
  //* first check if user is logged before request
  const user = await getCurrentUser()
  console.log("parameters: ", tags, linkId, user?.id)
  if (user?.role && user?.role !== "admin") {
    return { failure: "Not authenticated" }
  }

  //* check if fileId is created in db
  if (linkId) {
    const queryLinkExists = `
      SELECT * FROM Links_v2 WHERE id = ? AND uploadedUserId = ?`
    const valuesFileExists = [linkId, user?.id]
    try {
      const { results: linkExistsResults, error } = await dbConnect(queryLinkExists, valuesFileExists)

      if (error) {
        return { failure: "error in checking file is in Files"}
      }

      if (linkExistsResults[0][0].id != linkId) {
        console.error("Link not found")
        return { failure: "Link not found createTagPostLink"}
      }

      //* insert tags
      for (const tagName of tags) {
        const tagResponse = await getTagId(tagName);

        if (tagResponse.failure) {
          return { failure: "failed in getTagId() " }
        }
  
        const tagId = tagResponse.tagId 
      
        // Linking tags to the file
        const queryInsert = `
          INSERT INTO LinkTags_v2 (linkId, tagId) VALUES (?, ?)`
        const valuesInsert = [linkId, tagId]
        await dbConnect(queryInsert, valuesInsert);
      }
      return { success: "Tags and LinkTags inserted successful"}
      
    } catch (error) {
      console.error("Internal server error in createTagPost()")
      return { failure: "Internal server error in createTagPost()"}
    }
  }
}