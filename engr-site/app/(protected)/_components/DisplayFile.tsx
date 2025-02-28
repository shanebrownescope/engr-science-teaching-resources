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
        <div className="resource-header">
          <h2 className="resource-title">{file.fileName}</h2>
          <div className="resource-metadata">
            <div className="resource-date">
              <span className="metadata-label">Date:</span> {file.uploadDate}
            </div>
            <div className="resource-contributor">
              <span className="metadata-label">Posted By:</span> {file.contributor}
            </div>
          </div>
          {file.description && (
            <div className="resource-description">
              <p>{file.description}</p>
            </div>
          )}
        </div>

        <div className="resource-content">
          <iframe
            src={file.s3Url}
            style={{
              width: "100%",
              height: "790px",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
            }}
            title={file.fileName}
          />
        </div>

        {file?.tags?.length > 0 && (
          <div className="resource-tags-section">
            <h3 className="tags-heading">Tags</h3>
            <div className="resource-tags-container">
              {file?.tags?.map((tag: any, index: number) => {
                if (typeof tag === "string") {
                  return (
                    <div key={index} className="resource-tag-item">
                      {tag}
                    </div>
                  );
                }
                return null;
              })}
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
          width: 100%;
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