import { FetchedFile } from "@/utils/types";

type SimilarDocProps = {
  file: FetchedFile;
};

const SimilarDoc = ({ file }: SimilarDocProps) => {
  return (
    <div style={{ padding: "2em", border: "1px solid black", width: "200px" }}>
      <p> {file.fileName} </p>
      <div style={{ display: "flex", gap: "1em" }}>
        {file.tags?.map((tag: string, idx: number) => (
          <p
            key={idx}
            style={{
              background: "black",
              color: "white",
              padding: "0.5em",
              borderRadius: "1em",
            }}
          >
            {" "}
            {tag}{" "}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SimilarDoc;
