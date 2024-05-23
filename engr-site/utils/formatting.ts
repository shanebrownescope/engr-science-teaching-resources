/**
 ** File has function for formatting dates, words, etc
 */

export type FormattedData = {
  id: number | string;
  name: string;
  url: string;
};

//* Ref: fetchCourses.ts
export const lowercaseAndReplaceSpace = (
  id: number | string,
  input: string,
): FormattedData => {
  console.log(input, id);

  const fieldValue = input;
  const lowerCase = fieldValue.toLowerCase();
  const formattedValue = lowerCase.replace(/ /g, "-");
  console.log(formattedValue);
  const final = {
    id: id,
    name: fieldValue,
    url: formattedValue,
  };
  // console.log(final)
  return final;
};

export const lowercaseAndReplaceSpaceString = (input: string): string => {
  const fieldValue = input;
  const lowerCase = fieldValue.toLowerCase();
  const formattedValue = lowerCase.replace(/ /g, "-");
  console.log(formattedValue);

  return formattedValue;
};

export const capitalizeAndReplaceDash = (name: string): string => {
  console.log(name);
  const wordWithSpaces = name.replace(/-/g, " ");
  const formattedValue = capitalizeWords(wordWithSpaces);
  console.log(formattedValue);
  return formattedValue;
};

export const capitalizeWords = (input: string): string => {
  console.log(input);
  const exceptions = new Set(["and", "an", "a", "the", "for", "of"]);

  //* split string into array of words
  const splitWordIntoArray = input.toLowerCase().split(" ");

  //* uppercase first letter in word if not found in exceptions
  const formattedWord = splitWordIntoArray.map((word, i) => {
    if (!exceptions.has(word)) {
      return (word = word.charAt(0).toUpperCase() + word.slice(1));
    }
  });

  console.log(formattedWord);
  return formattedWord.join(" ");
};

export const formatTimeAgo = (uploadDate: string) => {
  const currentTime = new Date();
  console.log("currentTime", currentTime);
  const createdAt: Date = new Date(uploadDate);
  console.log("createdAt", createdAt);

  const timeDifference = currentTime.getTime() - createdAt.getTime();
  console.log("timeDiff", timeDifference);
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const monthsDifference = Math.floor(daysDifference / 30);
  const yearsDifference = Math.floor(monthsDifference / 12);

  if (yearsDifference > 0) {
    return `${yearsDifference} year${yearsDifference > 1 ? "s" : ""} ago`;
  } else if (monthsDifference > 0) {
    return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
  } else if (daysDifference > 0) {
    return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
  } else if (minutesDifference > 0) {
    return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
  } else {
    return `${secondsDifference} second${secondsDifference > 1 ? "s" : ""} ago`;
  }
};
