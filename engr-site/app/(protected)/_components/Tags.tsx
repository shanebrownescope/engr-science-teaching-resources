"use client";

type TagsProps = {
  tags: string[];
  loading: boolean;
  handleAddTag: () => void;
  handleTagChange: (index: number, value: string) => void;
};

const Tags = ({ tags, loading, handleAddTag, handleTagChange }: TagsProps) => {
  return (
    <div>
      <h1>Tags</h1>
      {tags.map((tag, index) => (
        <div key={index}>
          <input
            type="text"
            disabled={loading}
            value={tag}
            onChange={(e) => handleTagChange(index, e.target.value)}
          />
        </div>
      ))}
      <button type="button" disabled={loading} onClick={handleAddTag}>
        Add Tag
      </button>
    </div>
  );
};

export default Tags;
