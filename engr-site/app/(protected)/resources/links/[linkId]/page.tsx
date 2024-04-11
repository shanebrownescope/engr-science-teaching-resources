import {
  fetchFileById,
  FetchedFileData,
} from "@/actions/fetching/fetchFileById";
import { fetchLinkById } from "@/actions/fetching/fetchLinkById";
import { fetchSimilarFilesByTags } from "@/actions/fetching/fetchSimilarFilesByTags";
import { fetchSimilarLinksByTags } from "@/actions/fetching/fetchSimilarLinksByTags";

import { DisplayFile } from "@/app/(protected)/_components/DisplayFile";
import { DisplayLink } from "@/app/(protected)/_components/DisplayLink";
import SimilarDoc from "@/components/custom/SimilarDoc";
import SimilarLink from "@/components/custom/SimilarLink";
import {
  FetchedFile,
  FetchedFilesDataArray,
  FetchedLink,
  FetchedLinkData,
  FetchedLinksDataArray,
} from "@/utils/types";
import { notFound } from "next/navigation";

const ResourceLinkPage = async ({ params }: { params: { linkId: string } }) => {
  const { linkId } = params;
  const result = await fetchLinkById({ id: linkId });
  let similarItems:  FetchedLinksDataArray | null = null;

  //* fetching similar files or links
  if (result && result.success && result.success.tags) {
    console.log(result.success.tags);

    if (result.success?.tags?.length > 0) {
      similarItems = await fetchSimilarLinksByTags({
        linkId: linkId,
        tags: result.success.tags,
      });
      console.log(similarItems);
    }

    console.log(result.success);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2em" }}>
      {result?.success && (
        <DisplayLink link={result.success as FetchedLink} />
      )}

      <div>
        <h3>Similar resources </h3>
        <div style={{ display: "flex", gap: "1em" }}>
          {similarItems?.success?.map((item, idx) => (
            <div key={idx}>
              <SimilarLink link={item as FetchedLink} />
            </div>
          ))}
        </div>
      </div>

      <h3>Comments</h3>
    </div>
  );
};

export default ResourceLinkPage;
