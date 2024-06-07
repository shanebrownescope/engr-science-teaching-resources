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
      <h6 className="mt-4 mb-3">Tags</h6>
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
      <button
        type="button"
        className="mt-2"
        disabled={loading}
        onClick={handleAddTag}
      >
        Add Tag
      </button>
    </div>
  );
};

export default Tags;
