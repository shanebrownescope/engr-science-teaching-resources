"use server";
import s3 from "@/utils/s3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getNameFromKey } from "@/utils/helpers";

export const fetchCourseNamesAWS = async (folderKey: string) => {
  try {
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: folderKey,
    };

    const { Contents } = await s3.send(
      new ListObjectsV2Command(getObjectParams)
    );

    if (!Contents) {
      console.error("Contents are undefined in the response");
      return { failure: "Contents are undefined" };
    }

    console.log("-- contents: ", Contents);
    const courseNameFromKey = await getNameFromKey(Contents);

    // const courseNameFromKey = Contents &&
    //   Contents.map((object) => {
    //     console.log("object: ", object?.Key)
    //     // Extract course name from the object key
    //     const courseName = object?.Key?.split('/')[1];
    //     console.log(courseName)

    //     return courseName;
    //   });

    const courseList = courseNameFromKey?.filter((value, index, self) => {
      return self.indexOf(value) === index && value && value.length > 0;
    });

    // const formattedList = lowercaseAndReplaceSpaceList(courseList, 'CourseName')

    return { success: { courseList: courseList } };

    // const file = Contents?.find((object) => object?.Key.endsWith(fileName));
  } catch (error) {
    console.error(error);
    return { failure: "Internal server error, error retrieving file from s3" };
  }
};
