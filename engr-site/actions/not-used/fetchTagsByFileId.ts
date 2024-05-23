// "use server";

// import dbConnect from "@/database/dbConnector";

// type FetchedFilesData = {
//   success?: TagsData[];
//   failure?: string;
// };

// export type TagsData = {
//   TagId: number;
//   TagName: string;
// };

// type fetchTagsByFileIdProps = {
//   id: number;
// };

// export const fetchTagsByFileId = async ({
//   id,
// }: fetchTagsByFileIdProps): Promise<FetchedFilesData> => {
//   const selectFileTagsQuery = `
//     SELECT * FROM FileTags WHERE FileId = ?`;
//   const { results: fileTagsResult, error: fileTagsError } = await dbConnect(
//     selectFileTagsQuery,
//     [id]
//   );

//   if (fileTagsError) {
//     console.error("Error retrieving data from the database:", fileTagsError);
//     return { failure: "Internal server error" };
//   }

//   if (fileTagsResult[0].length <= 0) {
//     return { success: [] };
//   }

//   const tagIds = fileTagsResult[0].map((fileTag: any) => fileTag.TagId);
//   console.log(tagIds);

//   const selectTagsQuery = `
//   SELECT * FROM Tags WHERE TagId IN (?)`;
//   const { results: tagsResult, error: tagsError } = await dbConnect(
//     selectTagsQuery,
//     [tagIds]
//   );

//   if (tagsError) {
//     console.error("Error retrieving tags from the database:", tagsError);
//     return { failure: "Internal server error" };
//   }

//   console.log(tagsResult[0]);

//   return { success: tagsResult[0] };
// };
