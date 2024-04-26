"use server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3 from "@/utils/s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { sanitizeUrl, validUrlPattern } from "@/utils/helpers";



let TESTUSERID = 26


type UploadLinkProps = {
  linkName: string, 
  linkUrl: string
  conceptId: number,
  description: string | null,
  contributor: string,
  uploadDate: string
};

export const uploadLink = async ({ linkName, linkUrl, conceptId, description, contributor, uploadDate }: UploadLinkProps) => {
  //* first check if user is logged before request

  const user = await getCurrentUser()

  if (user?.role && user.role !== "admin") {
    return { failure: "Not authenticated" }
  }

  //* checking if url matches url pattern
  const pattern = validUrlPattern
  if (!pattern.test(linkUrl)) {
    return { failure: "Invalid URL format"}
  }

  const sanitizedUrl = sanitizeUrl(linkUrl)

  if (sanitizedUrl !== linkUrl || sanitizedUrl.includes('<') || sanitizedUrl.includes('>')) {
    return { failure: "URL was altered during sanitization. Not storing in database"}
  }

  if (!linkName || !linkUrl  || !conceptId || !uploadDate ) {
    return { failure: "Missing required fields"}
  }

  console.log(sanitizedUrl)

  console.log(linkName)
 

  const query = `
    INSERT INTO Links_v2 (linkName, linkUrl, description, uploadDate, contributor, conceptId, uploadedUserId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  //* extracts url without query parameters
  console.log(uploadDate)
  const values = [linkName, sanitizedUrl, description, uploadDate, contributor, conceptId, user?.id]

  try {
    const { results, error } = await dbConnect(query, values)

    if (error) {
      return {failure: "error in inserting data in Files"}
    }

    const [ linkResult ] = results

    const linkId = linkResult.insertId

    if (linkId) {
      return {success: {linkId: linkId}}
    } else {
      return {failure: "error inserting link"}
    }

  } catch (error) {
    console.error(error);
    return {failure: "Internal server error"}
  }
}
