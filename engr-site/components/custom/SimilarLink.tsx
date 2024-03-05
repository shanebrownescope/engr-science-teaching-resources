import { fetchedLink } from "@/utils/types"

type SimilarLinkProps = {
  link: fetchedLink
}

const SimilarLink = ({link}: SimilarLinkProps) => {
  return (
    <div style={{padding: "2em", border: "1px solid black", width: "200px"}}>
      <p> {link.originalLinkName} </p>
      <div style={{display: "flex", gap: "1em"}}>
        {link.tags?.map((tag: string, idx: number) => 
          <p   
            key={idx}
            style={{
              background: "black",
              color: "white",
              padding: "0.5em",
              borderRadius: "1em",
        }}> {tag} </p>)}
      </div>
    </div>
  )
}

export default SimilarLink