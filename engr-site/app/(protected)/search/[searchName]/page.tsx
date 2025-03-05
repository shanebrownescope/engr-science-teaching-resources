"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react"; // Ensure React is imported

import { Pagination } from "@mantine/core";
import { fetchSearchResults } from "@/actions/fetching/search/fetchSearchResults";
import {
  AllFilesAndLinksDataFormatted,
  FetchedSearchResults,
} from "@/utils/types_v2";
import { capitalizeAndReplaceDash } from "@/utils/formatting";
import { SearchFilterMenu } from "@/components/custom/search/SearchFilterMenu";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import ContainerLayout from "@/components/custom/containerLayout/ContainerLayout";

const SearchResults = ({ params }: { params: { searchName: string } }) => {
  useRequireAuth();
  const formattedSearchName = capitalizeAndReplaceDash(
    params.searchName.toLowerCase().replace(/-/g, " "),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesData, setResourcesData] = useState<AllFilesAndLinksDataFormatted[]>([]);
  
  // Fetch all files+links resources data
  useEffect(() => {
    const fetchFilesAndLinks = async () => {
      try {
        const data: FetchedSearchResults = await fetchSearchResults(
          formattedSearchName.toLowerCase(),
        );

        if (data?.failure) {
          console.log("Error loading search results")
          return;
        }
        setResourcesData(data?.success || []);
      } catch (error) {
        console.error("Error loading search results:", error)
      } finally {
        setIsLoading(false)
      }
    };

    fetchFilesAndLinks();

  }, [params.searchName]);

  console.log("---FETCHED RESULTS: ", resourcesData);

  return (
    (!isLoading &&
      <ContainerLayout paddingTop="md"> 
        <h4 className="text-center mb-4">Your Search: {formattedSearchName}</h4>
        <div>
          <SearchFilterMenu resourcesData={resourcesData}/>
        </div>
      </ContainerLayout>  
    )
  );
};

export default SearchResults;
