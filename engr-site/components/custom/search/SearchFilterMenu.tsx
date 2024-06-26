import React, { useState } from "react";
import { ComboboxItem, MultiSelect, Select } from "@mantine/core";
import { YearSlider } from "../../mantine";
import styles from "@/components/custom/search/SearchFilterMenu.module.css";
import { AllFilesAndLinksDataFormatted } from "@/utils/types";
import ResourcesListPaginated from "./ResourcesListPaginated";

type SearchFilterMenuProps = {
  data: AllFilesAndLinksDataFormatted[];
};

/**
 * Renders a search filter menu.
 *
 * @param {SearchFilterMenuProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SearchFilterMenu component.
 */
export const SearchFilterMenu = ({ data }: SearchFilterMenuProps) => {
  // State to keep track of sorting option
  const [sortBy, setSortBy] = useState<string | null>("");

  // Function to handle sorting change
  const handleSortChange = (value: string | null) => {
    setSortBy(value);
  };

  // Apply sorting based on the selected option
  let sortedData = data.slice(); // Create a copy of the data array
  if (sortBy === "Newest") {
    sortedData = data
      .slice()
      .sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      );
  } else if (sortBy === "Oldest") {
    sortedData = data
      .slice()
      .sort(
        (a, b) =>
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime(),
      );
  }

  console.log(sortedData);

  return (
    <div>
      <div className={styles.filterMenu}>
        <Select
          label="Sort by"
          placeholder="Pick value"
          data={["Newest", "Oldest", "Most Popular"]}
          value={sortBy}
          onChange={handleSortChange}
        />
        <MultiSelect
          label="Tags"
          placeholder="Pick value"
          data={["Science", "Math", "History", "Literature"]}
        />
      </div>

      <ResourcesListPaginated data={sortedData} />
    </div>  );
};
