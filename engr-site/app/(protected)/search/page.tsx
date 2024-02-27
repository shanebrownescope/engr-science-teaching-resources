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
        {/* This div centers the button horizontally and adds space */}
        <div className="shorterWidth">
          {" "}
          {/* This div ensures the button's max-width */}
          <SearchButton />
        </div>
      </div>
    </div>
  );
}
