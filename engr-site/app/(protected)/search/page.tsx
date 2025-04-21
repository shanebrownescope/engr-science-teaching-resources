"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import { SearchButton } from "@/components/mantine"; // Import the SearchButton component

type searchParams = {
  q: string;
}

const SearchResults = ({ searchParams }: { searchParams: searchParams }) => {
  useRequireAuth();
  const formattedSearchName = capitalizeAndReplaceDash(
    searchParams.q.toLowerCase().replace(/-/g, " "),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesData, setResourcesData] = useState<AllFilesAndLinksDataFormatted[]>([]);
  
  // Fetch all files+links resources data
  useEffect(() => {
    const fetchFilesAndLinks = async () => {
      setIsLoading(true)
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
  }, [searchParams.q]);
  
  return (
    (!isLoading &&
      <ContainerLayout paddingTop="md">         
        <div className="mb-4">
          <SearchButton value={searchParams.q}/>
        </div>
        
        <div>
          <SearchFilterMenu resourcesData={resourcesData}/>
        </div>
      </ContainerLayout>  
    )
  );
};

export default SearchResults;