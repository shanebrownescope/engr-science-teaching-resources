import { FetchedFile } from '@/utils/types';

type SimilarDocProps = {
  file: FetchedFile;
};

const calculateWidth = (tags) => {
  const baseWidth = 200;
  const widthPerTag = 30;
  if (!tags || tags.length === 0) {
    return `${baseWidth}px`;
  }
  return `${baseWidth + tags.length * widthPerTag}px`;
};

const SimilarDoc = ({ file }: SimilarDocProps) => {
  const dynamicWidth = calculateWidth(file.tags);

  return (
    <div
      style={{ padding: '2em', border: '1px solid black', width: dynamicWidth }}
    >
      <p> {file.fileName} </p>
      <div style={{ display: 'flex', gap: '1em' }}>
        {file.tags?.map((tag: string, idx: number) => (
          <p
            key={idx}
            style={{
              background: 'black',
              color: 'white',
              padding: '0.5em',
              borderRadius: '1em',
            }}
          >
            {tag}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SimilarDoc;
