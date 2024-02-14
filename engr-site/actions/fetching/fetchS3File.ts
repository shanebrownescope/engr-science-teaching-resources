"use server"
import s3 from "@/utils/s3Client";
import { GetObjectAclCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const fetchS3File = async() => {
  try {
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: 'testFolder/testfile1'
    }

    const { Contents } = await s3.send(new ListObjectsV2Command(getObjectParams));
    console.log("-- contents: ", Contents)

    // const file = Contents?.find((object) => object?.Key.endsWith(fileName));

  } catch (error) {
    console.error(error);
    return { failure: "Internal server error, error retrieving file from s3" }
  }
}