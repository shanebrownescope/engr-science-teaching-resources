import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { FetchedFile } from "@/utils/types_v2";
import { Rating } from "@mantine/core";

type DisplayFileProps = {
  file: FetchedFile;
};

export const DisplayFile = ({ file }: DisplayFileProps) => {
  return (
    <ContainerLayout paddingTop="md">
      <div className="resource-container">

        <div className="resource-info-container">
          <p> Uploaded on: {file.uploadDate} </p>
          <p> Posted By: {file.contributor}</p>
          <p> Resource Type: {file.resourceType} </p>
          {file.avgRating && (
            <div className="resource-rating-container">
              <p>Average Rating: </p> 
              <Rating value={file.avgRating} fractions={2} readOnly />
            </div>
          )}
        </div>
        <iframe
          src={file.s3Url}
          style={{
            width: "100%",
            height: "790px",
          }}
        />
        
        <div className="resource-tags-container">
          <p> Tags: </p>
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

        <div className="resource-tags-container">
          <p> Relevant Courses: </p>
          {file?.courses?.map((course: any, index: number) => {
            if (typeof course === "string") {
              return (
                <p key={index} className="resource-tag-item">
                  {course}
                </p>
              );
            }
            return null; // or handle non-string courses as needed
          })}
        </div>

        <div className="resource-tags-container">
          <p> Relevant Course Topics: </p>
          {file?.courseTopics?.map((courseTopic: any, index: number) => {
            if (typeof courseTopic === "string") {
              return (
                <p key={index} className="resource-tag-item">
                  {courseTopic}
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