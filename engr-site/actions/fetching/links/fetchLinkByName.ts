"use server";

import dbConnect from "@/database/dbConnector";
import { processLink } from "@/utils/helpers";
import { LinkData, FetchedLink } from "@/utils/types_v2";

type fetchLinkByNameProps = {
  name: string;
};

export type FetchedLinkData = {
  success?: FetchedLink;
  failure?: string;
};

/**
 * Asynchronously fetches a link from the database by its name
 * @param {fetchLinkByNameProps} props - An object containing the name of the link to fetch
 * @returns {Promise<FetchedLinkData>} An object containing the fetched link or an error message
 */
export const fetchLinkByName = async ({
  name
}: fetchLinkByNameProps): Promise<FetchedLinkData> => {
  try {
    const selectQuery = `
      SELECT 
        'link' AS type,
        l.id,
        l.linkName,
        l.linkUrl,
        l.description,
        l.uploadDate,
        c.contributorName AS contributor,
        l.resourceType,
        l.uploadedUserId,
        IFNULL(LinkTagConcat.tagName, '') AS tags,
        IFNULL(LinkCourseTopicConcat.courseTopicNames, '') AS courseTopics,
        IFNULL(LinkCourseTopicConcat.courseNames, '') AS courses,
        l.avgRating,
        l.numReviews
      FROM 
        Links_v3 AS l
      LEFT JOIN 
        (
          SELECT 
            lt.linkId, 
            GROUP_CONCAT(t.tagName SEPARATOR ', ') AS tagName
          FROM 
            LinkTags_v3 AS lt
          JOIN 
            Tags_v3 AS t ON lt.tagId = t.id
          GROUP BY 
            lt.linkId
        ) AS LinkTagConcat
      ON 
        l.id = LinkTagConcat.linkId
      LEFT JOIN 
        Contributors_v3 AS c 
      ON 
        l.contributorId = c.id
      LEFT JOIN 
        (
          SELECT 
            ctl.linkId,
            GROUP_CONCAT(DISTINCT ct.courseTopicName SEPARATOR ', ') AS courseTopicNames,
            GROUP_CONCAT(DISTINCT co.courseName SEPARATOR ', ') AS courseNames
          FROM 
            CourseTopicLinks_v3 AS ctl
          LEFT JOIN 
            CourseTopics_v3 AS ct ON ctl.courseTopicId = ct.id
          LEFT JOIN 
            Courses_v3 AS co ON ct.courseId = co.id
          GROUP BY 
            ctl.linkId
        ) AS LinkCourseTopicConcat 
      ON 
        l.id = LinkCourseTopicConcat.linkId
      WHERE l.linkName = ?
      GROUP BY 
        l.id
    `;

    const { results: linkResult, error } = await dbConnect(selectQuery, [name]);

    if (error) {
      console.log("Error when fetching link: ", error)
      return { failure: "Internal server error" };
    }

    if (linkResult[0].length > 0) {
      const link: LinkData = linkResult[0][0];

      const processedLink: FetchedLink = await processLink(link);

      return { success: processedLink };
    }

    return {
      failure: "No link found with that name",
    };
  } catch (error) {
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
