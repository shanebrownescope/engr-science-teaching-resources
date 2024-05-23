"use server";
import s3 from "@/utils/s3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getKeyFromContents } from "@/utils/helpers";

// !!! NOTE: THIS IS NOT USED IN THE SITE  !!!

// export const fetchCourseDataAWS = async (pathKey: string) => {
//   try {
//     const getObjectParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Prefix: pathKey,
//     };

//     const { Contents } = await s3.send(
//       new ListObjectsV2Command(getObjectParams)
//     );

//     if (!Contents) {
//       return { failure: "Contents are undefined" };
//     }

//     const courseData = await getKeyFromContents(Contents);

//     return { success: { courseData: courseData } };

//   } catch (error) {
//     return { failure: "Internal server error, error retrieving file from s3" };
//   }
// };
