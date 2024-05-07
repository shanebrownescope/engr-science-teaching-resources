import { FetchedFile, FetchedLink } from "@/utils/types";
import styles from "./similarResource.module.css";

type SimilarItemProps = {
  item: FetchedFile | FetchedLink;
  type: "file" | "link";
};

const SimilarItem = ({ item, type }: SimilarItemProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.name}>
        {type === "file"
          ? (item as FetchedFile).fileName
          : (item as FetchedLink).linkName}
      </p>

      <p> {item.description} </p>

      <div className={styles.tagsContainer}>
        {item.tags?.map((tag: string, idx: number) => (
          <div key={idx} className={styles.tag}>
            {" "}
            {tag}{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarItem;
