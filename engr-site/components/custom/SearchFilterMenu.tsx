import React, { useState } from "react";
import { MultiSelect, Select } from "@mantine/core";
import { YearSlider } from "../mantine";
import "./SearchFilterMenu.css";

export const SearchFilterMenu = () => {
  return (
    <div className="filterMenu">
      <Select
        label="Sort by"
        placeholder="Pick value"
        data={["Newest", "Oldest", "Most Popular"]}
      />
      <MultiSelect
        label="Tags"
        placeholder="Pick value"
        data={["Science", "Math", "History", "Literature"]}
      />
      <div className="yearSliderContainer">
        <YearSlider />
      </div>
    </div>
  );
};
