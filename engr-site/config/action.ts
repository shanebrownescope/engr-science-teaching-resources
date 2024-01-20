"use server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dbConnect from "@/database/dbConnector";

// import crypto from "crypto"
// const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

const generateTimestampedKey = (originalFilename: string) => {
  const timestamp = new Date().toISOString()
  return `${timestamp}_${originalFilename}`;
};


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

const acceptedTypes = [
  "application/pdf",
]
const maxFileSize = 1024 * 1024 * 10 //* 10MB
let TESTUSERID = 26


type GetSignedURLProps = {
  fileName: string;
  fileType: string;
  fileSize: number;
  checksum: string;
};

export const getSignedURL = async ({ fileName, fileType, fileSize, checksum }: GetSignedURLProps) => {
  //* first check if user is logged before request
  const session = true

  // if (!session) {
  //   return {failure: "Not authenticated"}
  // }
  
  
  if (!acceptedTypes.includes(fileType)) {
    console.log("expected file type", acceptedTypes[0], "got", fileType)
    return {failure: "Invalid file type"}
  } 
  
  if (fileSize > maxFileSize) {
    return {failure: "File too large"}
  }
  

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: generateTimestampedKey(fileName),
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum
  })

  //* signed url needs to be used in 60s in client
  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  //TODO: insert into db, Files table

  const query = `
    INSERT INTO Files (FileName, S3Url, UploadedUserId) VALUES (?, ?, ?)`
  //* extrats url without query parameters
  const values = [fileName, signedURL.split("?")[0], TESTUSERID]

  try {
    const { results, error } = await dbConnect(query, values)

    if (error) {
      return {failure: "error in inserting data in Files"}
    }

    const [ fileResult ] = results

    const fileId = fileResult.insertId

    if (fileId) {
      return {success: {url: signedURL, fileId: fileId}}
    }

  } catch (error) {
    console.error(error);
    return {failure: "Internal server error"}
  }
}




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
  console.log("parameters: ", tags, fileId, TESTUSERID)
  //* first check if user is logged before request
  const session = true
  // if (!session) {
  //   return {failure: "Not authenticated"}
  // }

  //* check if fileId is created in db
  if (fileId) {
    const queryFileExists = `
      SELECT * FROM Files WHERE FileId = ? AND UploadedUserId = ?`
    const valuesFileExists = [fileId, TESTUSERID]
    try {
      const { results: fileResults, error } = await dbConnect(queryFileExists, valuesFileExists)

      if (error) {
        return { failure: "error in checking file is in Files"}
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

export async function testingAction() {
  const query = 
  `INSERT INTO Tags (TagName) VALUES (?)`
  // `SELECT * FROM Tags`
  const { results, error } = await dbConnect(query, ["test action"])

  if (error) {
    return {failure: "testing action failed"}
  }

  const [ selectResults ] = results


  console.log("== results from test: ", selectResults.insertId)
  return {success: selectResults.insertId}

  

}