"use server";

import dbConnect from "@/database/dbConnector";

type FetchedLinksData = {
  success?: TagsData[];
  failure?: string;
};

export type TagsData = {
  TagId: number;
  TagName: string;
};

type fetchTagsByLinkIdProps = {
  id: number;
};

export const fetchTagsByLinkId = async ({
  id,
}: fetchTagsByLinkIdProps): Promise<FetchedLinksData> => {
  const selectLinkTagsQuery = `
    SELECT * FROM LinkTags WHERE LinkId = ?`;
  const { results: linkTagsResult, error: linkTagsError } = await dbConnect(
    selectLinkTagsQuery,
    [id]
  );

  if (linkTagsError) {
    console.error("Error retrieving data from the database:", linkTagsError);
    return { failure: "Internal server error" };
  }

  if (linkTagsResult[0].length <= 0) {
    return { success: [] };
  }

  const tagIds = linkTagsResult[0].map((linkTag: any) => linkTag.TagId);
  console.log(tagIds);

  const selectTagsQuery = `
  SELECT * FROM Tags WHERE TagId IN (?)`;
  const { results: tagsResult, error: tagsError } = await dbConnect(
    selectTagsQuery,
    [tagIds]
  );

  if (tagsError) {
    console.error("Error retrieving tags from the database:", tagsError);
    return { failure: "Internal server error" };
  }

  console.log(tagsResult[0]);

  return { success: tagsResult[0] };
};
