"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/utils/s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { sanitizeUrl, validUrlPattern } from "@/utils/helpers";

type UploadLinkProps = {
  linkUrl: string;
  conceptId: number;
  description: string | null;
  contributor: string;
  uploadDate: string;
};

/**
 * Uploads a link to the database and returns the ID of the link on success.
 * @param {UploadLinkProps} props - The properties of the link to be uploaded.
 * @returns {Promise<{success: {linkId: number}} | {failure: string}>} - A promise that resolves to an object with the success message and the ID of the link if the upload was successful, or a failure message if the upload was not successful.
 */
export const uploadLink = async ({
  linkUrl,
  conceptId,
  description,
  contributor,
  uploadDate,
}: UploadLinkProps) => {
  const user = await getCurrentUser();
  if (user?.role && user.role !== "admin") {
    return { failure: "Not authenticated" };
  }

  // Check if the link URL is valid
  const pattern = validUrlPattern;
  if (!pattern.test(linkUrl)) {
    return { failure: "Invalid URL format" };
  }

  // Sanitize the link URL
  const sanitizedUrl = sanitizeUrl(linkUrl);

  // Check if the link URL was altered during sanitization
  if (
    sanitizedUrl !== linkUrl ||
    sanitizedUrl.includes("<") ||
    sanitizedUrl.includes(">")
  ) {
    return {
      failure: "URL was altered during sanitization. Not storing in database",
    };
  }

  // Check if all required fields are present
  if (!linkUrl || !uploadDate) {
    return { failure: "Missing required fields" };
  }

  const query = `
    INSERT INTO Links_v2 (linkUrl, uploadDate, contributor, uploadedUserId) VALUES (?, ?, ?, ?)`;
  const values = [
    sanitizedUrl,
    uploadDate,
    contributor,
    user?.id,
  ];

  try {
    const { results, error } = await dbConnect(query, values);

    if (error) {
      return { failure: "error in inserting data in Files" };
    }

    const [linkResult] = results;

    const linkId = linkResult.insertId;

    if (linkId) {
      return { success: { linkId: linkId } };
    } else {
      return { failure: "error inserting link" };
    }
  } catch (error) {
    return { failure: "Internal server error" };
  }
};
