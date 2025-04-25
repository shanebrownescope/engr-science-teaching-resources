import React, { useState, useEffect } from "react";
import { ComboboxItem, MultiSelect, Select } from "@mantine/core";
import { YearSlider } from "../../mantine";
import styles from "@/components/custom/search/SearchFilterMenu.module.css";
import { AllFilesAndLinksDataFormatted } from "@/utils/types_v2";
import ResourcesListPaginated from "./ResourcesListPaginated";
import { fetchAllTags } from "@/actions/fetching/tags/fetchTagsByTagId";
import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { fetchContributors } from "@/actions/fetching/contributors/fetchContributors";
import { fetchCourseTopicsByCourseName } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseName";
import { lowercaseAndReplaceSpace } from "@/utils/formatting";

type SearchFilterMenuProps = {
  resourcesData: AllFilesAndLinksDataFormatted[]
};

/**
 * Renders a search filter menu.
 *
 * @param {SearchFilterMenuProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered SearchFilterMenu component.
 */
export const SearchFilterMenu = ({
  resourcesData
}: SearchFilterMenuProps) => {

  const [selectedSortBy, setSelectedSortBy] = useState<string | null>('most-popular');
  const [isLoading, setIsLoading] = useState(true);

  const [tagsData, setTagsData] = useState<any[]>([]);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [courseTopicsData, setCourseTopicsData] = useState<any[]>([]);
  const [contributorsData, setContributorsData] = useState<any[]>([]);

  const [selectedTags, setSelectedTags] = useState<any[]>();
  const [selectedCourses, setSelectedCourses] = useState<any[]>();
  const [selectedCourseTopics, setSelectedCourseTopics] = useState<any[]>()
  const [selectedContributors, setSelectedContributors] = useState<any[]>();
  const [selectedResourceType, setSelectedResourceType] = useState<any>();
  const [selectedMaterialType, setSelectedMaterialType] = useState<any>();

  const [filteredData, setFilteredData] = useState<AllFilesAndLinksDataFormatted[]>(resourcesData);

  // Fetch filter component options when page mounts
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true)
      try {
        // fetch tags
        const tagsResponse = await fetchAllTags()
        if (tagsResponse.success) {
          setTagsData(tagsResponse.success)
        }

        // fetch courses
        const coursesResponse = await fetchCourses()
        if (coursesResponse.success) {
          setCoursesData(coursesResponse.success)
        }

        // fetch contributors
        const contributorsResponse = await fetchContributors()
        if (contributorsResponse.success) {
          setContributorsData(contributorsResponse.success)
        }

      } catch (error) {
        console.error("Error loading filter options data:", error)
      } finally {
        setIsLoading(false)
      }
    };

    fetchFilterOptions();

  }, []);

  // console.log(" -- tagsData: ", tagsData)
  // console.log(" -- coursesData: ", coursesData)
  // console.log(" -- contributorsData: ", contributorsData)

  // Functions to handle changes in filter selection

  const handleSortBySelect = (value: string | null) => {
    setSelectedSortBy(value || null);
  };

  const handleTagsSelect = async (value?: string[]) => {
    if (!value || value.length === 0) {
      setSelectedTags([]);
      return;
    }
    setSelectedTags(value);
  };

  const handleCoursesSelect = async (value?: string[]) => {
    // Update the selected courses
    setSelectedCourses(value);

    if (!value || value.length === 0) {
      // If no courses are selected, reset the course topics data and selected topics
      setCourseTopicsData([]);
      setSelectedCourseTopics([]);
      return;
    }
  
    try {
      // Fetch course topics for each course ID and combine the results (array of fetched objects)
      const results = await Promise.all(
        value.map((courseName) => fetchCourseTopicsByCourseName(courseName))
      );
  
      // Combine all the course topics into a single array (flatMap == map + flat)
      const combinedCourseTopics = results.flatMap((result) => result.success || []);
  
      // Update the course topics data state
      setCourseTopicsData(combinedCourseTopics);
  
      // Filter the selected course topics to keep only those associated with the remaining courses
      setSelectedCourseTopics((prevSelectedTopics) => {
        return prevSelectedTopics?.filter((topic) =>
          combinedCourseTopics.some((ct) => ct.name == topic)
        );
      });
    } catch (error) {
        console.error('Error fetching course topics:', error);
    }
  };

  const handleCourseTopicsSelect = async (value?: string[]) => {
    if (!value || value.length === 0) {
      setCourseTopicsData([]);
      return;
    }
    setSelectedCourseTopics(value);
  };

  const handleResourceTypeSelect = (value: string | null) => {
    setSelectedResourceType(value || null);
  };

  const handleMaterialTypeSelect = (value: string | null) => {
    setSelectedMaterialType(value || null);
  };

  const handleContributorsSelect = async (value?: string[]) => {
    if (!value || value.length === 0) {
      setSelectedContributors([]);
      return;
    }
    setSelectedContributors(value);
  };

  // Function to apply filters to resources data when selected value(s) change
  // Idea: Resource must match any value in a single filter (UNION) across all filters (INTERSECTION) if selected
  const applyFilters = () => {
    return resourcesData.filter((resource) => {
      // Filter by tags (if any tags are selected)
      const matchesTags =
        !selectedTags ||
        selectedTags.length === 0 ||
        selectedTags.some((tag) => resource.tags.includes(tag));
  
      // Filter by courses (if any courses are selected)
      const matchesCourses =
        !selectedCourses ||
        selectedCourses.length === 0 ||
        selectedCourses.some((course) => resource.courses.includes(course));
  
      // Filter by course topics (if any course topics are selected)
      const matchesCourseTopics =
        !selectedCourseTopics ||
        selectedCourseTopics.length === 0 ||
        selectedCourseTopics.some((topic) => resource.courseTopics.includes(topic));
  
      // Filter by resource type (if a resource type is selected)
      const matchesResourceType =
        !selectedResourceType || resource.resourceType == selectedResourceType;

      // Filter by material type (if a material type is selected)
      const matchesMaterialType =
        !selectedMaterialType || resource.type == selectedMaterialType;
  
      // Filter by contributor (if any contributors are selected)
      const matchesContributors =
        !selectedContributors ||
        selectedContributors.length === 0 ||
        selectedContributors.some((contributor) => resource.contributor == contributor);
  
      // Return true only if the resource matches all selected filters
      return (
        matchesTags &&
        matchesCourses &&
        matchesCourseTopics &&
        matchesResourceType &&
        matchesMaterialType &&
        matchesContributors
      );
    });
  };

  // applies filters whenever selected state changes
  useEffect(() => {
    const filteredResources = applyFilters();
    setFilteredData(filteredResources);
    console.log(`-- CURRENT FILTERS SELECTED:\nTags: ${selectedTags}\nCourses: ${selectedCourses}\nCourseTopics: ${selectedCourseTopics}\nResourceType: ${selectedResourceType}\nMaterialType: ${selectedMaterialType}\nContributors: ${selectedContributors}`)
    console.log(`--FILTERED RESULTS: `, filteredData)
  }, [selectedTags, selectedCourses, selectedCourseTopics, selectedResourceType, selectedMaterialType, selectedContributors]);

  
  // applies sorting whenever sortBy filter state changes
  useEffect(() => {
    const sortResources = (data: AllFilesAndLinksDataFormatted[]): AllFilesAndLinksDataFormatted[] => {
      const sortedData = [...data]; // copy data to avoid mutating original data
      
      switch (selectedSortBy) {
        case 'most-popular':
          sortedData.sort((a, b) => {
            // First by average rating (descending)
            const ratingDiff = (b.avgRating || 0) - (a.avgRating || 0);
            if (ratingDiff !== 0) return ratingDiff;
            
            // Then by number of reviews (descending)
            return b.numReviews - a.numReviews;
          });
          break;

        case 'newest':
          sortedData.sort((a, b) => 
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          );
          break;

        case 'oldest':
          sortedData.sort((a, b) => 
            new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          );
          break;

        case 'new-trending':
          sortedData.sort((a, b) => {
            // Calculate a trending score combining recency and rating
            const now = new Date().getTime();
            const aDate = new Date(a.uploadDate).getTime();
            const bDate = new Date(b.uploadDate).getTime();
            
            // Time decay factor (30 days)
            const aTimeFactor = Math.max(0, 1 - (now - aDate) / (30 * 24 * 60 * 60 * 1000));
            const bTimeFactor = Math.max(0, 1 - (now - bDate) / (30 * 24 * 60 * 60 * 1000));
            
            const aScore = (a.avgRating || 0) * aTimeFactor;
            const bScore = (b.avgRating || 0) * bTimeFactor;
            
            return bScore - aScore;
          });
          break;

        default:
          // No sorting if unknown option
          return data;
      }

      return sortedData;
    };

    setFilteredData(prev => sortResources(prev));

  }, [selectedSortBy]);

  return (
    <>
      {!isLoading &&
        <div className={styles.filterMenu}>
          <Select
            label="Sort By"
            data={[
              { value: 'most-popular', label: 'Most Popular' },
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'new-trending', label: 'New and Trending' },
            ]}
            onChange={handleSortBySelect}
            value={selectedSortBy}
          />
          <MultiSelect
            label="Tags"
            data={tagsData?.map((tag) => ({
              value: tag.name, 
              label: tag.name
            }))}
            value={selectedTags || []}
            onChange={handleTagsSelect}
            searchable
          />
          <MultiSelect
            label="Courses"
            data={coursesData?.map((course) => ({
              value: course.name, 
              label: course.name
            }))}
            value={selectedCourses || []}
            onChange={handleCoursesSelect}
            searchable
          />
          <MultiSelect
            label="Course Topics"
            data={courseTopicsData?.map((topic) => ({
              value: topic.name, 
              label: topic.name
            }))}
            value={selectedCourseTopics || []}
            onChange={handleCourseTopicsSelect}
            searchable
          />
          <Select
            label="Resource Type"
            data={[
              { value: 'exercise', label: 'Exercise' },
              { value: 'notes', label: 'Notes' },
              { value: 'video', label: 'Video' },
              { value: 'interactive', label: 'Interactive Content' }
            ]}
            onChange={handleResourceTypeSelect}
            value={selectedResourceType || null}
          />
          <Select
            label="Material Type"
            data={[
              { value: 'file', label: 'File' },
              { value: 'link', label: 'Link' },
            ]}
            onChange={handleMaterialTypeSelect}
            value={selectedMaterialType || null}
          />
          <MultiSelect
            label="Contributor"
            data={contributorsData?.map((contributor) => ({
              value: trimCapitalizeFirstLetter(contributor.name), 
              label: trimCapitalizeFirstLetter(contributor.name)
            }))}
            value={selectedContributors || []}
            onChange={handleContributorsSelect}
            searchable
          />
        </div>
      }

      <ResourcesListPaginated data={filteredData} />
    </>
  );
};