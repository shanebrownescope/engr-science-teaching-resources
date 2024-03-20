import {
  capitalizeAndReplaceDash,
  lowercaseAndReplaceSpace,
} from "@/utils/formatting";
import { fetchFilesByConceptId } from "@/actions/fetching/fetchFilesByConceptId";
import Link from "next/link";
import { FetchedFile, FetchedLink } from "@/utils/types";
import { fetchLinksByConceptId } from "@/actions/fetching/fetchLinksByConceptId";
import { notFound } from "next/navigation";

type ConceptPageProps = {
  params: { courseName: string; module: string; concept: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const ConceptPage = async ({ params, searchParams }: ConceptPageProps) => {
  console.log({ params }, searchParams);
  const id = searchParams.id as string;

  const searchParamId = searchParams.id;

  if (!searchParamId) {
    return notFound();
  }

  console.log(id);
  const conceptName = capitalizeAndReplaceDash(params.concept);
  console.log(conceptName);
  const filesResult = await fetchFilesByConceptId({ id });
  const linksResult = await fetchLinksByConceptId({ id });

  filesResult?.success?.map((file) =>
    file.tags?.map((tag: any) => {
      // const values = Object.values(tag)
      console.log(typeof tag, tag);
      // console.log(values)
    })
  );

  return (
    <div>
      {filesResult?.success?.map((file: FetchedFile, idx: number) => (
        <Link
          href={`/resources/${file.formattedFileName}?${new URLSearchParams({
            id: file.fileId.toString(),
            type: "file",
          })} `}
          key={idx}
          style={{
            display: "flex",
            flexDirection: "column",
            marginInline: "auto",
            padding: "2em",
            border: "1px solid black",
            width: "450px",
            marginTop: "1em",
            textDecoration: "none",
            color: "black",
          }}
        >
          <h3> {file.originalFileName} </h3>
          <p> {file.description} </p>

          <div
            style={{
              display: "flex",
              gap: "1em",
            }}
          >
            {file.tags &&
              file.tags.length > 0 &&
              file.tags?.map((tag: any) => (
                <div
                  key={tag}
                  style={{
                    background: "black",
                    color: "white",
                    padding: "0.5em",
                    borderRadius: "1em",
                  }}
                >
                  {tag}
                </div>
              ))}
          </div>

          <div>
            <iframe src={file.s3Url}></iframe>
          </div>
        </Link>
      ))}

      {linksResult?.success?.map((link: FetchedLink, idx: number) => (
        <Link
          href={`/resources/${link.formattedLinkName}?${new URLSearchParams({
            id: link.linkId.toString(),
            type: "link",
          })} `}
          key={idx}
          style={{
            display: "flex",
            flexDirection: "column",
            marginInline: "auto",
            padding: "2em",
            border: "1px solid black",
            width: "450px",
            marginTop: "1em",
            textDecoration: "none",
            color: "black",
          }}
        >
          <h3> {link.originalLinkName} </h3>
          <p> {link.description} </p>
          <div
            style={{
              display: "flex",
              gap: "1em",
            }}
          >
            {link.tags?.map(
              (tag: string) =>
                tag && (
                  <div
                    key={tag}
                    style={{
                      background: "black",
                      color: "white",
                      padding: "0.5em",
                      borderRadius: "1em",
                    }}
                  >
                    {tag}
                  </div>
                )
            )}
          </div>
        </Link>
      ))}

      {!filesResult?.success && !filesResult?.success && (
        <p> no files or links </p>
      )}
    </div>
  );
};

export default ConceptPage;
