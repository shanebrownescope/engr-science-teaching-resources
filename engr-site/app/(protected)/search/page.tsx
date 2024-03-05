"use client";
import React from "react";
import "@mantine/core/styles.css";
import { SearchButton } from "@/components/mantine";
import "./page.css";

export default function Search() {
  return (
    <div>
      <h1>Search</h1>
      <div className="searchButtonContainer">
        {" "}
        <div className="shorterWidth">
          {" "}
          <SearchButton />
        </div>
      </div>
    </div>
  );
}
