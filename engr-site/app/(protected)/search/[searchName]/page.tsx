"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react"; // Ensure React is imported


import { Pagination } from "@mantine/core";
import { fetchSearchResults } from "@/actions/fetching/search/fetchSearchResults";
import {
  AllFilesAndLinksDataFormatted,
  FetchedSearchResults,
} from "@/utils/types";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { SearchFilterMenu } from "@/components/custom/search/SearchFilterMenu";

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
  const formattedSearchName = capitalizeAndReplaceDash(
    params.searchName.toLowerCase().replace(/-/g, " ")
  );
  const [data, setData] = useState<AllFilesAndLinksDataFormatted[]>([]);

  useEffect(() => {
    const fetchFilesAndLinks = async () => {
      const data: FetchedSearchResults = await fetchSearchResults(
        formattedSearchName.toLowerCase()
      );
      console.log(formattedSearchName);

      if (data?.failure) {
        return;
      }
      setData(data.success || []);
    };
    fetchFilesAndLinks();
  }, [params.searchName]);

  console.log("----data: ", data);

  console.log(data.map((item) => item.type));

  return (
    <div>
      <h1>Your Search: {formattedSearchName}</h1>
      <div>
        <SearchFilterMenu data={data} />
      </div>
    </div>
  );
};

export default SearchResults;
