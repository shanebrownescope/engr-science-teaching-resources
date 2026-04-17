"use server";

import dbConnect from "@/database/dbConnector";
import { processFile, processLink } from "@/utils/helpers";
import { FileData, LinkData, FetchedFile, FetchedLink } from "@/utils/types_v2";

export type FetchedUploads = {
  success?: { files: FetchedFile[]; links: FetchedLink[] };
  failure?: string;
};

export const fetchUploadsByUserId = async (
  userId: string
): Promise<FetchedUploads> => {
  try {
    const filesQuery = `
      SELECT
        'file' AS type,
        f.id,
        f.fileName,
        f.s3Url,
        f.description,
        f.uploadDate,
        c.contributorName AS contributor,
        f.resourceType,
        f.uploadedUserId,
        IFNULL(FileTagConcat.tagName, '') AS tags,
        IFNULL(FileCourseTopicConcat.courseTopicNames, '') AS courseTopics,
        IFNULL(FileCourseTopicConcat.courseNames, '') AS courses,
        f.avgRating,
        f.numReviews
      FROM Files_v3 AS f
      LEFT JOIN (
        SELECT ft.fileId, GROUP_CONCAT(t.tagName SEPARATOR ', ') AS tagName
        FROM FileTags_v3 AS ft
        JOIN Tags_v3 AS t ON ft.tagId = t.id
        GROUP BY ft.fileId
      ) AS FileTagConcat ON f.id = FileTagConcat.fileId
      LEFT JOIN Contributors_v3 AS c ON f.contributorId = c.id
      LEFT JOIN (
        SELECT ctf.fileId,
          GROUP_CONCAT(DISTINCT ct.courseTopicName SEPARATOR ', ') AS courseTopicNames,
          GROUP_CONCAT(DISTINCT co.courseName SEPARATOR ', ') AS courseNames
        FROM CourseTopicFiles_v3 AS ctf
        LEFT JOIN CourseTopics_v3 AS ct ON ctf.courseTopicId = ct.id
        LEFT JOIN Courses_v3 AS co ON ct.courseId = co.id
        GROUP BY ctf.fileId
      ) AS FileCourseTopicConcat ON f.id = FileCourseTopicConcat.fileId
      WHERE f.uploadedUserId = ?
      GROUP BY f.id
      ORDER BY f.uploadDate DESC
    `;

    const linksQuery = `
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
      FROM Links_v3 AS l
      LEFT JOIN (
        SELECT lt.linkId, GROUP_CONCAT(t.tagName SEPARATOR ', ') AS tagName
        FROM LinkTags_v3 AS lt
        JOIN Tags_v3 AS t ON lt.tagId = t.id
        GROUP BY lt.linkId
      ) AS LinkTagConcat ON l.id = LinkTagConcat.linkId
      LEFT JOIN Contributors_v3 AS c ON l.contributorId = c.id
      LEFT JOIN (
        SELECT ctl.linkId,
          GROUP_CONCAT(DISTINCT ct.courseTopicName SEPARATOR ', ') AS courseTopicNames,
          GROUP_CONCAT(DISTINCT co.courseName SEPARATOR ', ') AS courseNames
        FROM CourseTopicLinks_v3 AS ctl
        LEFT JOIN CourseTopics_v3 AS ct ON ctl.courseTopicId = ct.id
        LEFT JOIN Courses_v3 AS co ON ct.courseId = co.id
        GROUP BY ctl.linkId
      ) AS LinkCourseTopicConcat ON l.id = LinkCourseTopicConcat.linkId
      WHERE l.uploadedUserId = ?
      GROUP BY l.id
      ORDER BY l.uploadDate DESC
    `;

    const [filesResult, linksResult] = await Promise.all([
      dbConnect(filesQuery, [userId]),
      dbConnect(linksQuery, [userId]),
    ]);

    if (filesResult.error || linksResult.error) {
      console.error("[fetchUploadsByUserId] DB error:", filesResult.error ?? linksResult.error);
      return { failure: "Internal server error" };
    }

    const rawFiles: FileData[] = filesResult.results[0] ?? [];
    const rawLinks: LinkData[] = linksResult.results[0] ?? [];

    const files: FetchedFile[] = await Promise.all(
      rawFiles.map((f) => processFile(f))
    );
    const links: FetchedLink[] = await Promise.all(
      rawLinks.map((l) => processLink(l))
    );

    return { success: { files, links } };
  } catch (err) {
    console.error("[fetchUploadsByUserId] Unexpected error:", err);
    return { failure: "Internal server error" };
  }
};
