import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";
import { FetchedLink } from "@/utils/types";

type DisplayLinkProps = {
  link: FetchedLink;
};

export const DisplayLink = ({ link }: DisplayLinkProps) => {
  return (
    <ContainerLayout paddingTop="md">
      <div className="resource-container">
        <div className="resource-header">
          <h2 className="resource-title">{link.linkName}</h2>
          <div className="resource-metadata">
            <div className="resource-date">
              <span className="metadata-label">Date:</span> {link.uploadDate}
            </div>
            <div className="resource-contributor">
              <span className="metadata-label">Posted By:</span> {link.contributor}
            </div>
          </div>
          {link.description && (
            <div className="resource-description">
              <p>{link.description}</p>
            </div>
          )}
        </div>

        <div className="resource-content">
          <a 
            href={link.linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="resource-link-button"
          >
            Visit Resource
          </a>
        </div>

        {link.tags?.length > 0 && (
          <div className="resource-tags-section">
            <h3 className="tags-heading">Tags</h3>
            <div className="resource-tags-container">
              {link.tags?.map(
                (tag: string, index: number) =>
                  tag && (
                    <div key={index} className="resource-tag-item">
                      {tag}
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .resource-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .resource-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .resource-title {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .resource-metadata {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.875rem;
          color: #666;
        }
        .metadata-label {
          font-weight: 500;
        }
        .resource-description {
          margin-top: 0.5rem;
          line-height: 1.5;
        }
        .resource-content {
          display: flex;
          justify-content: flex-start;
          margin-top: 1rem;
        }
        .resource-link-button {
          display: inline-block;
          background-color: #3182ce;
          color: white;
          font-weight: 500;
          padding: 0.625rem 1.25rem;
          border-radius: 0.375rem;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .resource-link-button:hover {
          background-color: #2c5282;
        }
        .resource-tags-section {
          margin-top: 1.5rem;
        }
        .tags-heading {
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
        .resource-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .resource-tag-item {
          background-color: #f0f0f0;
          border-radius: 16px;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          white-space: nowrap;
        }
      `}</style>
    </ContainerLayout>
  );
};