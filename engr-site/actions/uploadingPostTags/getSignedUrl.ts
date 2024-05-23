"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/utils/s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeAndReplaceDash } from "@/utils/formatting";

/**
 * Adds '.pdf' extension to the given file name if it's not already present.
 *
 * @param {string} fileName - The file name to add '.pdf' extension to.
 * @return {string} The file name with '.pdf' extension added if it was not already present.
 */
const addPdfExtension = (fileName: string) => {
  if (!fileName.endsWith(".pdf")) {
    fileName += ".pdf";
  }
  return fileName;
};

/**
 * Generates a timestamped key for a file by appending a timestamp and replacing
 * any spaces in the original filename with dashes.
 *
 * @param {string} originalFilename - The original filename of the file.
 * @returns {string} The timestamped key for the file.
 */
const generateTimestampedKey = (originalFilename: string) => {
  // Append the extension '.pdf' if it's not already present
  const nameWithExtension = addPdfExtension(originalFilename);

  // Replace any spaces in the filename with dashes
  const filenameWithDashes = nameWithExtension.replace(/ /g, "-");

  // Generate the timestamp in ISO 8601 format
  const timestamp = new Date().toISOString();

  // Concatenate the timestamp and filename with a underscore
  return `${timestamp}_${filenameWithDashes}`;
};

const acceptedTypes = ["application/pdf"];
const maxFileSize = 1024 * 1024 * 10; //* 10MB
let TESTUSERID = 26;

type GetSignedURLProps = {
  fileName: string;
  fileType: string;
  fileSize: number;
  checksum: string;
  course: string;
  courseTopic: string;
  resourceType: string;
  concept: string;
  conceptId: number;
  description: string | null;
  contributor: string;
  uploadDate: string;
};

/**
 * Generates a pre-signed URL for uploading a file to S3.
 *
 * @param {Object} props - The properties of the file to be uploaded.
 * @param {string} props.fileName - The original filename of the file.
 * @param {string} props.fileType - The MIME type of the file.
 * @param {number} props.fileSize - The size of the file in bytes.
 * @param {string} props.checksum - The SHA256 checksum of the file.
 * @param {string} props.course - The course the file belongs to.
 * @param {string} props.courseTopic - The course topic the file belongs to.
 * @param {string} props.resourceType - The type of resource the file represents.
 * @param {string} props.concept - The concept the file represents.
 * @param {number} props.conceptId - The ID of the concept the file represents.
 * @param {string | null} props.description - The description of the file.
 * @param {string} props.contributor - The contributor of the file.
 * @param {string} props.uploadDate - The date the file was uploaded.
 * @returns {Object} - An object containing the pre-signed URL and the ID of the inserted file.
 * @throws {Object} - An object containing an error message if there was an error inserting the file.
 */
export const getSignedURL = async ({
  fileName,
  fileType,
  fileSize,
  checksum,
  course,
  courseTopic,
  resourceType,
  concept,
  conceptId,
  description,
  contributor,
  uploadDate,
}: GetSignedURLProps) => {
  const user = await getCurrentUser();

  // If the user is not logged in, or is not an admin, return an error
  if (user?.role && user.role !== "admin") {
    return { failure: "Not authenticated" };
  }

  // Check if the file type is accepted
  if (!acceptedTypes.includes(fileType)) {
    console.log("expected file type", acceptedTypes[0], "got", fileType);
    return { failure: "Invalid file type" };
  }

  // Check if the file size is too large
  if (fileSize > maxFileSize) {
    return { failure: "File too large" };
  }

  // Check if all required fields are present
  if (
    !fileName ||
    !fileType ||
    !fileSize ||
    !checksum ||
    !course ||
    !courseTopic ||
    !resourceType ||
    !concept ||
    !conceptId ||
    !uploadDate
  ) {
    return { failure: "Missing required fields" };
  }

  // Generate the unique file name
  const uniqueFileName = generateTimestampedKey(fileName);

  // Generate the file location in S3
  const fileLocation = `courses/${course}/courseTopic/${courseTopic}/resourceType/${resourceType}/${uniqueFileName}`;

  // Create a PutObjectCommand to upload the file to S3
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileLocation,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  // Generate a pre-signed URL to upload the file
  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  // Insert the file metadata into the database
  const query = `
    INSERT INTO Files_v2 (fileName, s3Url, description, uploadDate, contributor, conceptId, uploadedUserId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    uniqueFileName,
    signedURL.split("?")[0],
    description,
    uploadDate,
    contributor,
    conceptId,
    user?.id,
  ];

  try {
    const { results, error } = await dbConnect(query, values);
    if (error) {
      return { failure: "error in inserting data in Files" };
    }

    const [fileResult] = results;

    const fileId = fileResult.insertId;
    if (fileId) {
      return { success: { url: signedURL, fileId: fileId } };
    }
  } catch (error) {
    return { failure: "Internal server error" };
  }
};
