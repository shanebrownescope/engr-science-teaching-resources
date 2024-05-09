import styles from "@/components/custom/Similar-document-test/SImilarDocument.module.css";

export const SimilarDocument = ({}) => {
  const imageUrl =
    "https://t4.ftcdn.net/jpg/02/71/07/33/360_F_271073385_A6geLjwkrty3xkDPxaf7lcaEiNMtMwjN.jpg";
  const title = "Document Title";

  return (
    <div className={styles.documentContainer}>
      <img src={imageUrl} alt={title} className="document-image" />
      <div className={styles.overlay}>
        <p className={styles.imageTitle}>{"hello"}</p>
      </div>
    </div>
  );
};
