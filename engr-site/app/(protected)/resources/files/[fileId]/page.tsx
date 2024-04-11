import {
  fetchFileById,
} from "@/actions/fetching/fetchFileById";
import { fetchSimilarFilesByTags } from "@/actions/fetching/fetchSimilarFilesByTags";

import { DisplayFile } from "@/app/(protected)/_components/DisplayFile";
import SimilarDoc from "@/components/custom/SimilarDoc";
import {
  FetchedFile,
  FetchedFilesDataArray,
  FetchedLinksDataArray,
} from "@/utils/types";



const ResourceFilePage = async ({ params }: { params: { fileId: string } }) => {
  const { fileId } = params;

  const result =  await fetchFileById({ id: fileId });
  let similarItems: FetchedFilesDataArray | null = null;

  //* fetching similar files or links
  if (result && result.success && result.success.tags) {
    console.log(result.success.tags);

    if (result.success?.tags?.length > 0) {
      similarItems = await fetchSimilarFilesByTags({ 
        fileId: fileId,
        tags: result.success.tags,
      })

      console.log(similarItems);
    }

    console.log(result.success);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2em" }}>
      {result?.success && (
        <DisplayFile file={result.success as FetchedFile} />
      )}

      <div>
        <h3>Similar resources </h3>
        <div style={{ display: "flex", gap: "1em" }}>
          {similarItems?.success?.map((item, idx) => (
            <div key={idx}>
              <SimilarDoc file={item as FetchedFile} />
            </div>
          ))}
        </div>
      </div>

      <h3>Comments</h3>
      
    </div>
  );
};

export default ResourceFilePage;
