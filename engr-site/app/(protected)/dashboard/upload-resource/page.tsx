import { fetchCourses } from "@/actions/fetching/fetchCourses";
import { searchParams } from "@/utils/types";
import Link from "next/link";
import { FileUpload } from "@/app/(protected)/_components/FileUpload";
import { LinkUpload } from "@/app/(protected)/_components/LinkUpload";
import { notFound, redirect } from 'next/navigation'



const UploadResource = async ({ searchParams }: searchParams) => {
  const resourceVariants = ["file", "link"];

  const searchParamType = searchParams.type;

  if (searchParamType !== "link" && searchParamType !== "file") {
    return notFound()
  }
 
  const coursesOptionsData = await fetchCourses();
  console.log(coursesOptionsData.success);

  return (
    <div>
      {resourceVariants.map((media, index) => (
        <Link
          key={index}
          href={`?type=${media}`}
          style={{
            textDecoration: "none",
            padding: "0.5em",
            background: "#DEE0E1",
            color: "black",
            border: searchParamType === media ? "1px solid blue" : "none"
          }}
        >
          {media.toUpperCase()}
        </Link>
      ))}

      {searchParamType === "file" && <FileUpload coursesOptionsData={coursesOptionsData.success} />}
      {searchParamType === "link" &&  <LinkUpload coursesOptionsData={coursesOptionsData.success} />}
    </div>
  );
};

export default UploadResource;
