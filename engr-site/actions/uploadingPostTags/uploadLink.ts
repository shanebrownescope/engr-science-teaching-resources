"use server";
import dbConnect from "@/database/dbConnector";
import { getCurrentUser } from "@/utils/authHelpers";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { sanitizeUrl, validUrlPattern } from "@/utils/helpers";
import { fetchContributorByName } from "../fetching/contributors/fetchContributorByName";
import { fetchLinkByName } from "../fetching/links/fetchLinkByName";

type UploadLinkProps = {
  linkUrl: string;
  contributor: string;
  uploadDate: string;
  courses: string[];
  courseTopics: string[];
  resourceType: string;
};

/**
 * Uploads a link to the database and returns the ID of the link on success.
 * @param {UploadLinkProps} props - The properties of the link to be uploaded.
 * @returns {Promise<{success: {linkId: number}} | {failure: string}>} - A promise that resolves to an object with the success message and the ID of the link if the upload was successful, or a failure message if the upload was not successful.
 */
export const uploadLink = async ({
  linkUrl,
  contributor,
  uploadDate,
  courses,
  courseTopics,
  resourceType
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
  if (
    !linkUrl ||
    !courses ||
    courses.length == 0 ||
    !courseTopics ||
    courseTopics.length == 0 ||
    !resourceType ||
    !uploadDate
  ) {
    return { failure: "Missing required fields" };
  }

  // Generate random sequence of characters for linkName
  let linkName;
  let linkExists;
  const length = 16;

  do {
    // Generate a random string for the linkName
    linkName = Math.random().toString(36).substring(2, length + 2);

    // Check if the linkName already exists in the database
    linkExists = await fetchLinkByName({name: linkName});

  } while (linkExists.success)

  // Fetch contributor information in db if exists, o/w create a new entry
  let contributorId = null
  if (contributor != "Anonymous") {
    const fetchedContributor = await fetchContributorByName({name: contributor})

    if (fetchedContributor.success) {
      contributorId = fetchedContributor.success?.id
    } else {
      const query = `INSERT INTO Contributors_v3 (contributorName) VALUES (?)`

      try {
        const { results, error } = await dbConnect(query, [contributor]);
        if (error) {
          return { failure: "error in inserting new Contributor" };
        }
        const [contributorResult] = results;
        contributorId = contributorResult.insertId;

      } catch (error) {
        return { failure: "Internal server error" };
      }
    }
  }

  // Insert the link metadata into the database
  const query = `
    INSERT INTO Links_v3 (linkName, linkUrl, uploadDate, contributorId, resourceType, uploadedUserId) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    linkName,
    sanitizedUrl,
    uploadDate,
    contributorId,
    resourceType,
    user?.id,
  ];

  try {
    const { results, error } = await dbConnect(query, values);

    if (error) {
      return { failure: "error in inserting data in Links" };
    }

    const [linkResult] = results;
    const linkId = linkResult.insertId;

    if (linkId) {
      // Insert the Course Topics associated with this Link
      const query2 = `
        INSERT INTO CourseTopicLinks_v3 (linkId, courseTopicId) VALUES (?, ?)
      `;
      // Loop through each courseTopic and insert a record into CourseTopicLinks
      for (const courseTopicId of courseTopics) {
        const { results, error } = await dbConnect(query2, [linkId, courseTopicId]);

        if (error) {
          console.error("Error inserting into CourseTopicLinks:", error);
          return { failure: "Error inserting into CourseTopicLinks" };
        }
      }
      return { success: { linkId: linkId } };

    } else {
      return { failure: "error inserting link" };
    }
  } catch (error) {
    return { failure: "Internal server error" };
  }
};