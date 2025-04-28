import { AllFilesAndLinksDataFormatted, FetchedFile, FetchedLink, FetchedSearchResults } from "@/utils/types_v2";
import styles from "./similarResource.module.css";
import SimilarItem from "./SimilarItem";
import ContainerLayout from "../containerLayout/ContainerLayout";

type SimilarResourcesDataProps = {
  similarResources: AllFilesAndLinksDataFormatted[] | undefined;
};

/**
 * Renders the similar resources data.
 *
 * @param {SimilarResourcesDataProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SimilarResourcesData component.
 */
const SimilarResourcesData = ({
  similarResources
}: SimilarResourcesDataProps) => {
  return (
    <ContainerLayout paddingTop="md">
      <h5 className="mb-4">Similar resources </h5>
        {similarResources ? (
            <div className={styles.grid}>
              {similarResources.map((item, idx) => (
                <SimilarItem key={idx} item={item} />
              ))}
            </div>
        ) : <p> No similar resources </p>}
    </ContainerLayout>
  );
};

export default SimilarResourcesData;
