import { _Object } from "@aws-sdk/client-s3";

/**
 * 
 * @param Contents 
 * @returns the key (path to every item) from each object
 */
export const getKeyFromContents = async (Contents: _Object[] | undefined) => {
    console.log(Contents)
    const courseNameFromKey = Contents && 
    Contents.map((object) => {
    console.log("object: ", object.Key)
      // Extract course name from the object key
      console.log(object.Key)
      
      return object.Key;
    });

    return courseNameFromKey;
}


/**
 * 
 * @param Contents 
 * @returns the first sub folder key (name) 
 */
export const getNameFromKey = async (Contents: _Object[] | undefined) => {
  const courseNameFromKey = Contents && 
  Contents.map((object) => {
  console.log("object: ", object.Key)
    // Extract course name from the object key
    const courseName = object.Key?.split('/')[1];
    console.log(courseName)
    
    return courseName;
  });

  return courseNameFromKey;
}