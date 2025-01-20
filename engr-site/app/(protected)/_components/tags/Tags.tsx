import styles from './tags.module.css';

type TagsProps = {
  tags: string[];
  loading: boolean;
  handleAddTag: () => void;
  handleTagChange: (index: number, value: string) => void;
  handleRemoveTag: (index: number) => void;
};

const Tags = ({
  tags,
  loading,
  handleAddTag,
  handleTagChange,
  handleRemoveTag,
}: TagsProps) => {
  return (
    <div className={styles.tagsWrapper}>
      <label className={styles.label}>Add Tags (max 3)</label>
      {tags.map((tag, index) => (
        <div key={index} className={styles.tagInput}>
          <input
            type="text"
            value={tag}
            placeholder="Enter tag"
            disabled={loading}
            onChange={(e) => handleTagChange(index, e.target.value)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => handleRemoveTag(index)}
            disabled={loading}
            className={styles.deleteButton}
            aria-label="Remove tag"
          >
            ×
          </button>
        </div>
      ))}
      {tags.length < 3 && (
        <button
          type="button"
          onClick={handleAddTag}
          disabled={loading}
          className={styles.addTagButton}
        >
          Add Tag
        </button>
      )}
    </div>
  );
};

export default Tags;