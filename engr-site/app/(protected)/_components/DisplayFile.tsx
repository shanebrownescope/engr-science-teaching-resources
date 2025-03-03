import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { FetchedFile } from "@/utils/types";

type DisplayFileProps = {
  file: FetchedFile;
};

export const DisplayFile = ({ file }: DisplayFileProps) => {
  console.log(typeof file.tags, file.tags);
  file?.tags?.map((tag: any) => console.log(typeof tag));
  return (
    <ContainerLayout paddingTop="md">
      <div className="resource-container">
        <h2> {file.fileName} </h2>
        <div>
          <p> {file.uploadDate} </p>
          <p> {file.description} </p>
          <p> Posted By: {file.contributor}</p>
        </div>
        <iframe
          src={file.s3Url}
          style={{
            width: "100%",
            height: "790px",
          }}
        />
        <div className="resource-tags-container">
          {file?.tags?.map((tag: any, index: number) => {
            if (typeof tag === "string") {
              return (
                <p key={index} className="resource-tag-item">
                  {tag}
                </p>
              );
            }
            return null; // or handle non-string tags as needed
          })}
        </div>
      </div>
    </ContainerLayout>
  );
};