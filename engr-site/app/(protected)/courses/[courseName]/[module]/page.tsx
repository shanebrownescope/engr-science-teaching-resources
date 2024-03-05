import { fetchConceptsBySectionId } from "@/actions/fetching/fetchConceptsBySectionId";
import { fetchSectionsByModule } from "@/actions/fetching/fetchSectionsByModule";
import { useGetPathname } from "@/hooks/useGetPathname";

import {
  FormattedData,
  capitalizeAndReplaceDash,
  lowercaseAndReplaceSpace,
} from "@/utils/formatting";
import { fetchedFormattedData } from "@/utils/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "path";

type sectionDataResults = {
  sectionName: string;
  concepts: FormattedData[];
};

type ModulePageProps = {
  params: { module: string; courseName: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const ModulePage = async ({ params, searchParams }: ModulePageProps) => {
  console.log(params);
  console.log(searchParams);
  const id = searchParams.id as string;
  console.log(id);

  const searchParamId = searchParams.id;

  if (!searchParamId) {
    return notFound()
  }


  const sectionName = capitalizeAndReplaceDash(params.module);
  const sections: fetchedFormattedData = await fetchSectionsByModule({
    id: id,
  });
  console.log(sections.success);

  // Function to fetch data for a section based on its ID
  const fetchDataForSection = async (
    sectionId: number,
    original: string | undefined
  ) => {
    // Replace the following line with your actual function to fetch data for a section
    const results = await fetchConceptsBySectionId({ id: sectionId });

    return {
      sectionName: original,
      concepts: results.success,
    };
  };

  let sectionDataPromises: any = [];

  // Create an array of promises for fetching data for each section
  if (sections.success) {
    sectionDataPromises = sections.success.map((section) =>
      fetchDataForSection(section.id, section.original)
    );
  }

  // Use Promise.all to wait for all promises to resolve
  const sectionDataResults: sectionDataResults[] = await Promise.all(
    sectionDataPromises
  );
  console.log({ sectionDataResults });

  return (
    <div>
      <p> {sectionName} </p>
      {/* {sections?.success && sections.success.map((item, index) => (
        <div key={index}> {item.original} </div> )) 
      } */}

      {sectionDataResults?.map((section: sectionDataResults) => (
        <div>
          <p> {section.sectionName}</p>
          <div>
            {section.concepts?.map((concept: FormattedData) => {
              return (
                <div>
                  <Link
                    href={`/courses/${params.courseName}/${params.module}/${
                      concept.formatted
                    }?${new URLSearchParams({
                      id: concept.id.toString(),
                    })} `}
                  >
                    {concept.original}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {sections?.failure && <div> No sections </div>}
      {/* {sectionDataResults.map((item: any) => <div><p>hi</p></div>)} */}
    </div>
  );
};

export default ModulePage;
