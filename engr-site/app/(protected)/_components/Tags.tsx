"use client"

type TagsProps  = {
  tags: string[];
  handleAddTag: () => void;
  handleTagChange: (index: number, value: string) => void;
}

const Tags = ({tags, handleAddTag, handleTagChange}: TagsProps) => {

  return (
    <div>
    <h1>Tags</h1>
    {tags.map((tag, index) => (
      <div key={index}>
        <input
          type="text"
          value={tag}
          onChange={(e) => handleTagChange(index, e.target.value)}
        />
      </div>
    ))}
    <button onClick={handleAddTag}>Add Tag</button>
  </div>
  )
}

export default Tags