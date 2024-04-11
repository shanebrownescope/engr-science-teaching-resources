import { fetchTagsByFileId } from "@/actions/fetching/fetchTagsByFileId";
import { _Object } from "@aws-sdk/client-s3";
import {
  capitalizeAndReplaceDash,
  lowercaseAndReplaceSpace,
} from "./formatting";

import {
  AllFilesAndLinksData,
  FileData,
  LinkData,
  FetchedFile,
  FetchedLink,
} from "./types";
import { fetchTagsByLinkId } from "@/actions/fetching/fetchTagsByLinkId";

/**
 *
 * @param Contents
 * @returns the key (path to every item) from each object
 */
export const getKeyFromContents = async (Contents: _Object[] | undefined) => {
  console.log(Contents);
  const courseNameFromKey =
    Contents &&
    Contents.map((object) => {
      console.log("object: ", object.Key);
      // Extract course name from the object key
      console.log(object.Key);

      return object.Key;
    });

  return courseNameFromKey;
};

/**
 *
 * @param Contents
 * @returns the first sub folder key (name)
 */
export const getNameFromKey = async (Contents: _Object[] | undefined) => {
  const courseNameFromKey =
    Contents &&
    Contents.map((object) => {
      console.log("object: ", object.Key);
      // Extract course name from the object key
      const courseName = object.Key?.split("/")[1];
      console.log(courseName);

      return courseName;
    });

  return courseNameFromKey;
};

/**
 * @param File
 * @returns FetchedFile
 */

export const processFile = async (file: FileData): Promise<FetchedFile> => {
  const tags = file.TagNames?.some((tag: string | null) => tag === null)
    ? []
    : file.TagNames;

  const retrievedDate = new Date(file.UploadDate);
  const formattedDate = retrievedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const fileNameSplit1 = file.FileName.substring(
    file.FileName.indexOf("_") + 1
  );
  const formattedFileName = fileNameSplit1.substring(
    0,
    fileNameSplit1.indexOf(".pdf")
  );
  console.log(formattedFileName);

  const originalFileName = capitalizeAndReplaceDash(formattedFileName);
  console.log(originalFileName);

  console.log(file.Contributor);
  console.log(file.TagNames);

  return {
    fileId: file.FileId,
    originalFileName: originalFileName,
    formattedFileName: formattedFileName,
    s3Url: file.S3Url!,
    description: file.Description,
    uploadDate: formattedDate,
    contributor: file.Contributor,
    conceptId: file.ConceptId,
    uploadedUserId: file.UploadedUserId,
    tags: tags,
  };
};

/**
 * @param link
 * @returns FetchedLink
 */

export const processLink = async (link: LinkData): Promise<FetchedLink> => {
  const tags = link.TagNames?.some((tag: string | null) => tag === null)
    ? []
    : link.TagNames;
  const retrievedDate = new Date(link.UploadDate);
  const formattedDate = retrievedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  console.log(formattedDate);

  const formattedLinkName = link.LinkName.toLowerCase().replace(/ /g, "-");

  console.log(link.Contributor);

  console.log(link.Description);

  return {
    linkId: link.LinkId,
    originalLinkName: link.LinkName,
    formattedLinkName: formattedLinkName,
    linkUrl: link.LinkUrl!,
    description: link.Description,
    uploadDate: formattedDate,
    contributor: link.Contributor,
    conceptId: link.ConceptId,
    uploadedUserId: link.UploadedUserId,
    tags: tags,
  };
};

export const validUrlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i" // fragment locator
);

export const validateAndSanitizeURL = (url: string) => {
  if (!validUrlPattern.test(url)) {
    return "Invalid URL";
  }

  return url.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export const sanitizeUrl = (url: string) => {
  const test = url.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  console.log(typeof test);
  console.log(test);
  return url.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export const trimCapitalizeFirstLetter = (text: string) => {
  const trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export const processFilesAndLinks = (item: AllFilesAndLinksData) => {
  // Convert the concatenated tags string to an array
  // Split the 'Tags' string into an array by commas and remove whitespace from each tag with trim()
  const tags = item.Tags ? item.Tags.split(",").map((tag) => tag.trim()) : [];
  console.log(tags);

  if (item.Type === "file") {
    const fileNameSplit1 = item.Name.substring(item.Name.indexOf("_") + 1);
    const formattedFileName = fileNameSplit1.substring(
      0,
      fileNameSplit1.indexOf(".pdf")
    );

    const originalFileName = capitalizeAndReplaceDash(formattedFileName);

    return {
      type: item.Type,
      id: item.Id,
      originalName: originalFileName,
      formattedName: formattedFileName,
      description: item.Description,
      uploadDate: new Date(item.UploadDate),
      tags: tags,
    };
  } else if (item.Type === "link") {
    const formattedLinkName = item.Name.toLowerCase().replace(/ /g, "-");
    return {
      type: item.Type,
      id: item.Id,
      originalName: item.Name,
      formattedName: formattedLinkName,
      description: item.Description,
      uploadDate: new Date(item.UploadDate),
      tags: tags,
    };
  }
};


export const validateUploadFileData =(file: FileData) => {
  
}


export const transformObjectKeys = (object: any) => {
  return Object.keys(object).reduce((acc: any, key: string) => {
      acc[key.charAt(0).toLowerCase() + key.slice(1)] = object[key];
      return acc;
  }, {});
}
