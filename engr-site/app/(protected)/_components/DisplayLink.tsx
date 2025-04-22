import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { FetchedLink } from "@/utils/types_v2";

type DisplayLinkProps = {
  link: FetchedLink;
};

export const DisplayLink = ({ link }: DisplayLinkProps) => {
  return (
    <ContainerLayout paddingTop="md">
      <div className="resource-container">

        <div className="resource-info-container">
          <p> Uploaded on: {link.uploadDate} </p>
          <p> Posted By: {link.contributor}</p>
          <p> Resource Type: {link.resourceType} </p>
          {link.avgRating && <p> Average Rating: {link.avgRating} </p>}
        </div>
        <a href={link.linkUrl}> Visit resource </a>

        <div className="resource-tags-container">
          <p> Tags: </p>
            {link.tags?.map(
              (tag: string, index: number) =>
                tag && (
                  <p key={index} className="resource-tag-item">
                    {tag}
                  </p>
                ),
            )}
        </div>

        <div className="resource-tags-container">
          <p> Relevant Courses: </p>
          {link?.courses?.map((course: any, index: number) => {
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
          {link?.courseTopics?.map((courseTopic: any, index: number) => {
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