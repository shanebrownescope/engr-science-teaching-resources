import Link from "next/link";
import React from "react"; // Ensure React is imported
import { SearchResultBox, SearchFilterMenu } from "@/components/custom";
import { Pagination } from "@mantine/core";

// Mock data for demonstration
const mockResults = [
  {
    title: "The Secrets of Quantum Physics",
    description: "Delve into the mysterious world of quantum mechanics.",
    tags: ["Science", "Physics", "Quantum"],
  },
  {
    title: "Exploring the Depths of History",
    description: "A journey through time to understand our past.",
    tags: ["History", "Education", "Time"],
  },
  {
    title: "Mathematics in Real Life",
    description: "Discover how math applies to everyday situations.",
    tags: ["Math", "Education", "Real Life"],
  },
  {
    title: "The Evolution of Literature",
    description: "Trace the development of literature through the ages.",
    tags: ["Literature", "History", "Culture"],
  },
  {
    title: "Breaking Down the Barriers of Science",
    description: "How modern science is addressing today's challenges.",
    tags: ["Science", "Innovation", "Challenges"],
  },
];

const SearchResults = ({ params }: { params: { searchName: string } }) => {
  return (
    <div>
      <h1>Your Search: {decodeURIComponent(params.searchName)}</h1>
      <div>
        <SearchFilterMenu />
        {mockResults.map((result, index) => (
          <SearchResultBox
            key={index}
            title={result.title}
            description={result.description}
            tags={result.tags}
          />
        ))}
      </div>
      <Pagination total={10} />
    </div>
  );
};

export default SearchResults;
