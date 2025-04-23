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
  // Convert the concatenated tags string to an array
  // Split the 'Tags' string into an array by commas and remove whitespace from each tag with trim()
  const tags = file.tags ? file.tags.split(",").map((tag: string) => tag.trim()) : [];

  // Split the 'Courses' string into an array by commas and remove whitespace from each course with trim()
  const courses = file.courses ? file.courses.split(",").map((course: string) => course.trim()) : [];

  // Split the 'CourseTopics' string into an array by commas and remove whitespace from each courseTopic with trim()
  const courseTopics = file.courseTopics ? file.courseTopics.split(",").map((courseTopic: string) => courseTopic.trim()) : [];

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

  const originalFileName = formattedFileName.replace(/-/g, " ");
  const urlName = lowercaseAndReplaceSpaceString(formattedFileName);

  return {
    ...file,
    fileName: originalFileName,
    urlName: urlName,
    uploadDate: formattedDate,
    tags: tags,
    courses: courses,
    courseTopics: courseTopics
  };
};


export const processLink = async (link: any): Promise<any> => {
  // Convert the concatenated tags string to an array
  // Split the 'Tags' string into an array by commas and remove whitespace from each tag with trim()
  const tags = link.tags ? link.tags.split(",").map((tag: string) => tag.trim()) : [];

  // Split the 'Courses' string into an array by commas and remove whitespace from each course with trim()
  const courses = link.courses ? link.courses.split(",").map((course: string) => course.trim()) : [];

  // Split the 'CourseTopics' string into an array by commas and remove whitespace from each courseTopic with trim()
  const courseTopics = link.courseTopics ? link.courseTopics.split(",").map((courseTopic: string) => courseTopic.trim()) : [];

  const retrievedDate = new Date(link.uploadDate);
  const formattedDate = retrievedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const urlName = link.linkName.toLowerCase().replace(/ /g, "-");

  return {
    ...link,
    linkName: link.linkName,
    urlName: urlName,
    uploadDate: formattedDate,
    tags: tags,
    courses: courses,
    courseTopics: courseTopics
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

  // Split the 'Courses' string into an array by commas and remove whitespace from each course with trim()
  const courses = item.courses ? item.courses.split(",").map((course) => course.trim()) : [];

  // Split the 'CourseTopics' string into an array by commas and remove whitespace from each courseTopic with trim()
  const courseTopics = item.courseTopics ? item.courseTopics.split(",").map((courseTopic) => courseTopic.trim()) : [];

  const retrievedDate = new Date(item.uploadDate);
  const formattedDate = retrievedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

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
      uploadDate: formattedDate,
      tags: tags,
      courses: courses,
      courseTopics: courseTopics
    };
  } else if (item.type === "link") {
    const urlName = item.name.toLowerCase().replace(/ /g, "-");
    
    return {
      ...item,
      originalName: item.name,
      urlName: urlName,
      uploadDate: formattedDate,
      tags: tags,
      courses: courses,
      courseTopics: courseTopics
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

export const getAvatarColor = (name: string) => {
  // List of Mantine's built-in colors (excluding grayscale)
  const colors = [
    'red', 'pink', 'grape', 'violet', 'indigo', 
    'blue', 'cyan', 'teal', 'green', 'lime', 
    'yellow', 'orange'
  ];
  
  // Create a simple hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to pick a consistent color for this name
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
