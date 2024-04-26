"use server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3 from "@/utils/s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeAndReplaceDash } from "@/utils/formatting";


const addPdfExtension = (fileName: string) => {
  if (!fileName.endsWith('.pdf')) {
      fileName += '.pdf';
  }
  return fileName;
}

// import crypto from "crypto"
// const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")
const generateTimestampedKey = (originalFilename: string) => {
  //* replacing any spaces with '-'
  const nameWithExtension = addPdfExtension(originalFilename)
  console.log(nameWithExtension)
  const filenameWithDashes = nameWithExtension.replace(/ /g, '-');
  const timestamp = new Date().toISOString()
  return `${timestamp}_${filenameWithDashes}`;
};

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
  course: string;
  courseTopic: string;
  resourceType: string;
  concept: string,
  conceptId: number,
  description: string | null,
  contributor: string,
  uploadDate: string
};

export const getSignedURL = async ({ fileName, fileType, fileSize, checksum, course, courseTopic, resourceType, concept, conceptId, description, contributor, uploadDate }: GetSignedURLProps) => {
  //* first check if user is logged before request

  const user = await getCurrentUser()

  if (user?.role && user.role !== "admin") {
    return { failure: "Not authenticated" }
  }
  
  
  if (!acceptedTypes.includes(fileType)) {
    console.log("expected file type", acceptedTypes[0], "got", fileType)
    return { failure: "Invalid file type" }
  } 
  
  if (fileSize > maxFileSize) {
    return { failure: "File too large" }
  }
  
  if (!fileName || !fileType || !fileSize || !checksum || !course || !courseTopic || !resourceType || !concept || !conceptId || !uploadDate) {
    return { failure: "Missing required fields" }
  }

  //* encapsulates metadata used for generating a pre-signed URL
  const uniqueFileName = generateTimestampedKey(fileName)
  // const fileLocationTest = "testFolder/" + uniqueFilesName
  const fileLocation =  `courses/${course}/courseTopic/${courseTopic}/resourceType/${resourceType}/${uniqueFileName}`
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileLocation,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum
  })

  //* signed url needs to be used in 60s in client
  //* pre-signed URL will be used by the client to upload the object directly to S3 w/o credentials
  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  const query = `
    INSERT INTO Files_v2 (fileName, s3Url, description, uploadDate, contributor, conceptId, uploadedUserId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  //* extracts url without query parameters
  console.log(uploadDate)
  const values = [uniqueFileName, signedURL.split("?")[0], description, uploadDate, contributor, conceptId, user?.id]

  try {
    const { results, error } = await dbConnect(query, values)

    console.log("inserted new file: ", results[0].insertId)

    if (error) {
      return {failure: "error in inserting data in Files"}
    }

    const [ fileResult ] = results
    console.log("[fileResult]: ", fileResult)

    const fileId = fileResult.insertId
    console.log("fileId: ", fileId)
    
    if (fileId) {
      return { success: { url: signedURL, fileId: fileId } }
    }

  } catch (error) {
    console.error(error);
    return {failure: "Internal server error"}
  }
}