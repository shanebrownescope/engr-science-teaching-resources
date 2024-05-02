import { FetchedLink } from '@/utils/types';

type SimilarLinkProps = {
  link: FetchedLink;
};

const calculateWidth = (tags) => {
  const baseWidth = 200;
  const widthPerTag = 30;
  if (!tags || tags.length === 0) {
    return `${baseWidth}px`;
  }
  return `${baseWidth + tags.length * widthPerTag}px`;
};

const SimilarLink = ({ link }: SimilarLinkProps) => {
  const dynamicWidth = calculateWidth(link.tags);

  return (
    <div
      style={{ padding: '2em', border: '1px solid black', width: dynamicWidth }}
    >
      <p> {link.linkName} </p>
      <div style={{ display: 'flex', gap: '1em' }}>
        {link.tags?.map((tag: string, idx: number) => (
          <p
            key={idx}
            style={{
              background: 'black',
              color: 'white',
              padding: '0.5em',
              borderRadius: '1em',
            }}
          >
            {' '}
            {tag}{' '}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SimilarLink;
