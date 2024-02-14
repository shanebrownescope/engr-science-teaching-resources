/**
 ** File has function for formatting dates, words, etc
 */

export type formattedData = {
  id: number,
  original: string | undefined,
  formatted: string | undefined
}

//* Ref: fetchCourses.ts
export const lowercaseAndReplaceSpace = (
  items: any,
  fieldName: any,
  idName: any
): formattedData[] => {
  const formattedDataList: formattedData[] = [];

  console.log(fieldName)

  items.forEach((item: any, index: number) => {
    const fieldValue = item[fieldName];
    const lowerCase = fieldValue.toLowerCase()
    const formattedValue =
      lowerCase &&
      lowerCase.replace(/ /g, '-');

    formattedDataList[index] = {
      id: item[idName],
      original: fieldValue,
      formatted: formattedValue, // Handle cases where formattedValue is falsy
    };
  });

  console.log(formattedDataList)

  return formattedDataList;
};

// export const lowercaseAndReplaceSpace = ({items, field}: props) => {
//   const formattedDataList: formattedData[] = [];

//   // items.map((item, index) => {
//   //   const formattedValue = item && item.field.charAt(0).toLowerCase() + item.field.slice(1).replace(/ /g, '-');

//   //   formattedDataList[index] = {
//   //     id: item.CourseId,
//   //     original: item.CourseName,
//   //     formatted: formattedValue,
//   //   };

//   items.forEach((item, index) => {
//     const fieldValue = item[field];
//     console.log(fieldValue)
//     const formattedValue =
//       fieldValue &&
//       fieldValue.charAt(0).toLowerCase() + fieldValue.slice(1).replace(/ /g, '-');

//     formattedDataList[index] = {
//       id: item.id,
//       original: fieldValue,
//       formatted: formattedValue || '', // Handle cases where formattedValue is falsy
//     };
//   });
//   return formattedDataList
// };