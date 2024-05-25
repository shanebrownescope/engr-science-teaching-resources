import { FetchedFile } from "@/utils/types";

type DisplayFileProps = {
  file: FetchedFile;
};

export const DisplayFile = ({ file }: DisplayFileProps) => {
  console.log(typeof file.tags, file.tags);
  file?.tags?.map((tag: any) => console.log(typeof tag));
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        width: '50%',
      }}
    >
      <h2> {file.fileName} </h2>
      {file.description}
      <p> {file.uploadDate} </p>
      <p> Posted By: {file.contributor}</p>
      <iframe
        src={file.s3Url}
        style={{
          width: '100%',
          height: '790px',
        }}
      />
      <div style={{ display: 'flex', gap: '1em' }}>
        {file?.tags?.map((tag: any, index: number) => {
          if (typeof tag === 'string') {
            return (
              <p
                key={index}
                style={{
                  background: 'black',
                  color: 'white',
                  padding: '0.5em',
                  borderRadius: '1em',
                }}
              >
                {tag}
              </p>
            );
          }
          return null; // or handle non-string tags as needed
        })}
      </div>
    </div>
  );
};
