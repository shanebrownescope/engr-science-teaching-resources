import React, { useState } from 'react';
import { Pagination } from '@mantine/core';
import { AllFilesAndLinksDataFormatted } from '@/utils/types';
import { SearchResultBox } from '.';

type ResourcesListPaginatedProps = {
  data: AllFilesAndLinksDataFormatted[]
}

const ResourcesListPaginated =({ data }: ResourcesListPaginatedProps) => {
  // The number of items to display on each page
  const itemsPerPage = 6;
  // Total number of items in the data array
  const totalItems = data.length;

  // Calculate the total number of pages, needed for pagination
  // The Math.ceil() method is needed to round up the number of pages
  // if the total number of items is not divisible by the items per page
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // State to keep track of which page the user is currently on
  // Initially set to page 1
  const [currentPage, setCurrentPage] = useState(1);
  // Type annotation for the currentPage state variable
  // It's a number because the value will be incremented or
  // decremented, and we'll be using it in calculations

  // Calculate start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the array to get items for the current page
  const currentPageItems = data.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      {/* Render currentPageItems */}
      <div>
        {currentPageItems.map((item) => (
          // Render individual file/link item here
          <div key={item.id}>
            <SearchResultBox
              type={item.type}
              id={item.id}
              title={item.originalName}
              urlName={item.urlName}
              description={item.description}
              tags={item.tags}
          />  
          </div>
        ))}
      </div>
      {/* Render Pagination component */}
      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={handlePageChange}
      />
    </>
  );
}

export default ResourcesListPaginated;