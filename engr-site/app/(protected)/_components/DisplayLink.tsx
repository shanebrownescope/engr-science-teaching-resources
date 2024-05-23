import { FetchedLink } from "@/utils/types";

type DisplayLinkProps = {
  link: FetchedLink;
};

export const DisplayLink = ({ link }: DisplayLinkProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        border: "1px solid black",
        width: "50%",
      }}
    >
      <h2> {link.linkName} </h2>
      {link.description}
      <p> {link.uploadDate} </p>
      <a href={link.linkUrl}> {link.linkName} </a>
      <p> {link.contributor}</p>
      <div style={{ display: "flex", gap: "1em" }}>
        {link.tags?.map(
          (tag: string, index: number) =>
            tag && (
              <p
                key={index}
                style={{
                  background: "black",
                  color: "white",
                  padding: "0.5em",
                  borderRadius: "1em",
                }}
              >
                {tag}
              </p>
            ),
        )}
      </div>
    </div>
  );
};
