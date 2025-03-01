import { _Object } from "@aws-sdk/client-s3";
import { lowercaseAndReplaceSpaceString } from "./formatting";

import {
  AllFilesAndLinksData,
  FileData,
  LinkData,
  FetchedFile,
  FetchedLink,
} from "./types_v2";

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


export const processFile = async (file: any): Promise<any> => {
  console.log("tagNames: ", file.tagNames);
  let tags: any;

  // Convert [null] to an empty array if the first element is null
  if (file.tagNames?.length === 1 && file.tagNames[0] === null) {
    tags = [];
  } else {
    tags = file.tagNames;
  }

  // const tags = file.tagNames?.some((tag: string | null) => tag === null)
  //   ? []
  //   : file.tagNames;

  const retrievedDate = new Date(file.uploadDate);
  const formattedDate = retrievedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const fileNameSplit1 = file.fileName.substring(
    file.fileName.indexOf("_") + 1,
  );
  const formattedFileName = fileNameSplit1.substring(
    0,
    fileNameSplit1.indexOf(".pdf"),
  );
  console.log(formattedFileName);

  // const originalFileName = capitalizeAndReplaceDash(formattedFileName);
  const originalFileName = formattedFileName.replace(/-/g, " ");
  console.log(originalFileName);

  console.log(file.contributor);
  console.log(file.tagNames);

  const urlName = lowercaseAndReplaceSpaceString(formattedFileName);

  return {
    ...file,
    type: "file",
    fileName: originalFileName,
    urlName: urlName,
    uploadDate: formattedDate,
    tags: tags,
  };
};


export const processLink = async (link: any): Promise<any> => {
  let tags: any;
  // Convert [null] to an empty array if the first element is null
  if (link.tagNames?.length === 1 && link.tagNames[0] === null) {
    tags = [];
  } else {
    tags = link.tagNames;
  }

  const retrievedDate = new Date(link.uploadDate);
  const formattedDate = retrievedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  console.log(formattedDate);

  const urlName = link.linkName.toLowerCase().replace(/ /g, "-");

  console.log(link.contributor);

  console.log(link.description);

  return {
    ...link,
    type: "link",
    urlName: urlName,
    uploadDate: formattedDate,
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
  "i", // fragment locator
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
  const tags = item.tags ? item.tags.split(",").map((tag) => tag.trim()) : [];
  console.log(tags);

  if (item.type === "file") {
    const fileNameSplit1 = item.name.substring(item.name.indexOf("_") + 1);
    const formattedFileName = fileNameSplit1
      .substring(0, fileNameSplit1.indexOf(".pdf"))
      .replace(/-/g, " ");

    // const originalFileName = capitalizeAndReplaceDash(formattedFileName);

    const urlName = lowercaseAndReplaceSpaceString(formattedFileName);

    return {
      ...item,
      originalName: formattedFileName,
      urlName: urlName,
      uploadDate: new Date(item.uploadDate),
      tags: tags,
    };
  } else if (item.type === "link") {
    const urlName = item.name.toLowerCase().replace(/ /g, "-");
    return {
      ...item,
      originalName: item.name,
      urlName: urlName,
      uploadDate: new Date(item.uploadDate),
      tags: tags,
    };
  }
};

export const validateUploadFileData = (file: FileData) => {};

export const transformObjectKeys = (object: any) => {
  return Object.keys(object).reduce((acc: any, key: string) => {
    acc[key.charAt(0).toLowerCase() + key.slice(1)] = object[key];
    return acc;
  }, {});
};
