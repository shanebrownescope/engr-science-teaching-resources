"use server";
import s3 from "@/utils/s3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getKeyFromContents } from "@/utils/helpers";

export const fetchCourseDataAWS = async (pathKey: string) => {
  try {
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: pathKey,
    };

    const { Contents } = await s3.send(
      new ListObjectsV2Command(getObjectParams)
    );

    if (!Contents) {
      console.error("Contents are undefined in the response");
      return { failure: "Contents are undefined" };
    }

    console.log("-- contents: ", Contents);

    const courseData = await getKeyFromContents(Contents);

    return { success: { courseData: courseData } };

    // const file = Contents?.find((object) => object?.Key.endsWith(fileName));
  } catch (error) {
    console.error(error);
    return { failure: "Internal server error, error retrieving file from s3" };
  }
};
