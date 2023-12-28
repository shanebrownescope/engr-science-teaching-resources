"use server"

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const acceptedTypes = [
  "pdf",
]

const maxFileSize = 1024 * 1024 * 10 //* 10MB

export const getSignedURL = async (fileType, fileSize, checksum) => {
  //* first check if user is logged before request
  const session = true

  // if (!session) {
  //   return {failure: "Not authenticated"}
  // }

  
  
  // if (!acceptedTypes.includes(fileType)) {
  //   return {failure: "Invalid file type"}
  // } 
  
  // if (fileSize > maxFileSize) {
  //   return {failure: "File too large"}
  // }
  
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "test-file-4",
    // ContentType: fileType,
    // ContentLength: fileSize,
    // ChecksumSHA256, checksum,
    // Metadata: {
      
    // }
  })

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });


  return {success: {url: signedURL}}
}