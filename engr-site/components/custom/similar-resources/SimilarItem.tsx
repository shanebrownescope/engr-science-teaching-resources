import { AllFilesAndLinksDataFormatted, FetchedFile, FetchedLink } from "@/utils/types_v2";
import styles from "./similarResource.module.css";
import Link from "next/link";

type SimilarItemProps = {
  item: AllFilesAndLinksDataFormatted;
};

/**
 * Renders a similar item card.
 *
 * @param {SimilarItemProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SimilarItem component.
 */
const SimilarItem = ({ item }: SimilarItemProps) => {
  return (
    <div className={styles.container}>
      <Link 
        href={`/resources/${item.type}/${item.urlName}`}
      >
        <p className={styles.name}>
          {item.urlName}
        </p>

        <p>{item.description}</p>

        <div className={styles.tagsContainer}>
          {item.tags?.map((tag: string, idx: number) => (
            <div key={idx} className={styles.tag}>
              {" "}
              {tag}{" "}
            </div>
          ))}
        </div>
        
      </Link>
    </div>
  );
};

export default SimilarItem;
