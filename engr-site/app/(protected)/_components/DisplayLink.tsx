import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { FetchedLink } from "@/utils/types";

type DisplayLinkProps = {
  link: FetchedLink;
};

export const DisplayLink = ({ link }: DisplayLinkProps) => {
  return (
    <ContainerLayout paddingTop="md">
      <div className="resource-container">
        <h2> {link.linkName} </h2>
        <div>
          <p> {link.uploadDate} </p>
          <p> Posted By: {link.contributor}</p>
          <p> {link.description} </p>
          <p>Resource Category: {link.resourceCategory || "N/A"}</p>
          {link.externalContributor && (
            <p>Uploaded by External Faculty</p>
           )}
        </div>
        <a href={link.linkUrl}> Visit resource </a>
        <div className="resource-tags-container">
          {link.tags?.map(
            (tag: string, index: number) =>
              tag && (
                <p key={index} className="resource-tag-item">
                  {tag}
                </p>
              ),
          )}
        </div>
      </div>
    </ContainerLayout>
  );
};
