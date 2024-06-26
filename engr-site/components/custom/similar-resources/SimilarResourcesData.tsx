import { FetchedFile, FetchedLink } from "@/utils/types";
import styles from "./similarResource.module.css";
import SimilarItem from "./SimilarItem";
import ContainerLayout from "../containerLayout/ContainerLayout";

type SimilarResourcesDataProps = {
  similarResources: FetchedFile[] | FetchedLink[] | undefined;
  type: "file" | "link";
};

/**
 * Renders the similar resources data.
 *
 * @param {SimilarResourcesDataProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SimilarResourcesData component.
 */
const SimilarResourcesData = ({
  similarResources,
  type,
}: SimilarResourcesDataProps) => {
  return (
    <ContainerLayout paddingTop="md">
      <h5 className="mb-4">Similar resources </h5>

      <div className={styles.grid}>
        {similarResources &&
          type === "file" &&
          similarResources.map((item, idx) => (
            <SimilarItem key={idx} item={item as FetchedFile} type="file" />
          ))}

        {similarResources &&
          type === "link" &&
          similarResources.map((item, idx) => (
            <SimilarItem key={idx} item={item as FetchedLink} type="link" />
          ))}
      </div>

      {similarResources?.length === 0 && <div> No similar resources </div>}
    </ContainerLayout>
  );
};

export default SimilarResourcesData;
