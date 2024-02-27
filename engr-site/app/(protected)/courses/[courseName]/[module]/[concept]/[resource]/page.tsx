import { fetchFileById } from "@/actions/fetching/fetchFileById";
import { fetchLinkById } from "@/actions/fetching/fetchLinkById";
import {
  TagsData,
  fetchTagsByFileId,
} from "@/actions/fetching/fetchTagsByFileId";
import { DisplayFile } from "@/app/(protected)/_components/DisplayFile";
import { DisplayLink } from "@/app/(protected)/_components/DisplayLink";
import { notFound } from "next/navigation";


type FilePageProps = {
  params: { courseName: string; module: string; concept: string; file: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const FilePage = async ({ params, searchParams }: FilePageProps) => {
  console.log(searchParams.id);
  const id = searchParams.id as string;

  const searchParamType = searchParams.type
  let fileResult;
  let linkResult

  if (searchParamType === "file") {
    fileResult = await fetchFileById({ id });
    console.log(fileResult.success);
  } else if (searchParamType === "link") {
    linkResult = await fetchLinkById({ id });
    console.log(linkResult.success);
  } else {
    return notFound()
  }



  return (
    <div>
      {fileResult?.success && <DisplayFile file={fileResult.success} />}
      {linkResult?.success && <DisplayLink link={linkResult.success} />}
      <h3> Comments </h3>


      
    </div>
  );
};

export default FilePage;
