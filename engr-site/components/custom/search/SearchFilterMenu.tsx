import React, { useState, useEffect } from "react";
import { Button, ComboboxItem, Group, MultiSelect, Select, Text, Tooltip } from "@mantine/core";
import { IconFilterOff, IconInfoCircle } from "@tabler/icons-react"; 
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
      setSelectedCourseTopics([]);
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

  // applies filters and/or sorting whenever selected state changes
  useEffect(() => {
    const sortAndFilterResources = () => {
      // First apply all filters
      const filteredResources: AllFilesAndLinksDataFormatted[] = applyFilters();

      // Copy array of filtered resources to avoid mutating original data
      let sortedResources = [...filteredResources];

      // Then apply sorting if selected
      if (selectedSortBy) {
        switch (selectedSortBy) {
          case 'most-popular':
            sortedResources.sort((a, b) => {
              // First by average rating (descending)
              const ratingDiff = (b.avgRating || 0) - (a.avgRating || 0);
              if (ratingDiff !== 0) return ratingDiff;
              
              // Then by number of reviews (descending)
              return b.numReviews - a.numReviews;
            });
            break;

          case 'newest':
            sortedResources.sort((a, b) => 
              new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
            );
            break;

          case 'oldest':
            sortedResources.sort((a, b) => 
              new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
            );
            break;

          case 'new-trending':
            sortedResources.sort((a, b) => {
              // Boost ratings for recent items (last 7 days)
              const now = Date.now();
              const aDate = new Date(a.uploadDate).getTime();
              const bDate = new Date(b.uploadDate).getTime();
              
              const aIsRecent = (now - aDate) < 7 * 24 * 60 * 60 * 1000;
              const bIsRecent = (now - bDate) < 7 * 24 * 60 * 60 * 1000;
              
              // Add a small boost to recent items when comparing ratings
              const aScore = (a.avgRating || 0) + (aIsRecent ? 0.75 : 0);
              const bScore = (b.avgRating || 0) + (bIsRecent ? 0.75 : 0);
              
              const scoreDiff = bScore - aScore;
              if (scoreDiff !== 0) return scoreDiff;
              
              // Fall back to upload date if scores are equal
              return bDate - aDate;
            });
            break;

          default:
            // No sorting if unknown option
            return sortedResources;
        }
      }

      setFilteredData(sortedResources);
      console.log(`-- CURRENT FILTERS SELECTED:\nSortBy: ${selectedSortBy}\nTags: ${selectedTags}\nCourses: ${selectedCourses}\nCourseTopics: ${selectedCourseTopics}\nResourceType: ${selectedResourceType}\nMaterialType: ${selectedMaterialType}\nContributors: ${selectedContributors}`)
      console.log(`--FINAL FILTERED+SORTED RESULTS: `, filteredData)
    }

    sortAndFilterResources()

  }, [
    selectedSortBy, 
    selectedTags, 
    selectedCourses, 
    selectedCourseTopics, 
    selectedResourceType, 
    selectedMaterialType, 
    selectedContributors
  ]);

  // Helper function to clear selected filter values
  const resetAllFilters = () => {
    setSelectedTags([]);
    setSelectedCourses([]);
    setSelectedCourseTopics([]);
    setSelectedContributors([]);
    setSelectedResourceType(null);
    setSelectedMaterialType(null);
    setSelectedSortBy('most-popular');
    setCourseTopicsData([]); 
  };

  // Helper function to render label with tooltip
  const renderLabelWithTooltip = (label: string, tooltip: string) => (
    <div className={styles.labelWithTooltip}>
      <span>{label}</span>
      <Tooltip label={tooltip} position="right" withArrow>
        <IconInfoCircle size={16} className={styles.infoIcon} />
      </Tooltip>
    </div>
  );

  return (
    <>
      {!isLoading &&
        <div className={styles.layoutContainer}>
            <div className={styles.filterColumn}>
              <div className={styles.filterMenu}>
                <Group justify="space-between" align="center" mb="md">
                  <Text fw={500}>Filters</Text>
                  <Button 
                    variant="subtle" 
                    size="xs" 
                    onClick={resetAllFilters}
                    leftSection={<IconFilterOff size={14} />}
                    disabled={
                      !selectedTags?.length &&
                      !selectedCourses?.length &&
                      !selectedCourseTopics?.length &&
                      !selectedContributors?.length &&
                      !selectedResourceType &&
                      !selectedMaterialType &&
                      selectedSortBy === 'most-popular'
                    }
                  >
                    Reset
                  </Button>
                </Group>
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
                  allowDeselect={false}
                />
                <MultiSelect
                  label={renderLabelWithTooltip("Tags", "Filter resources by specific keywords or categories")}
                  data={tagsData?.map((tag) => ({
                    value: tag.name, 
                    label: tag.name
                  }))}
                  value={selectedTags || []}
                  onChange={handleTagsSelect}
                  searchable
                />
                <MultiSelect
                  label={renderLabelWithTooltip("Courses", "Filter resources by specific courses")}
                  data={coursesData?.map((course) => ({
                    value: course.name, 
                    label: course.name
                  }))}
                  value={selectedCourses || []}
                  onChange={handleCoursesSelect}
                  searchable
                />
                <div className={styles.topicSectionContainer}>
                  <MultiSelect
                    label={renderLabelWithTooltip("Course Topics", "Filter resources by specific topics within courses")}
                    data={courseTopicsData?.map((topic) => ({
                      value: topic.name, 
                      label: topic.name
                    }))}
                    value={selectedCourseTopics || []}
                    onChange={handleCourseTopicsSelect}
                    searchable
                    disabled={!selectedCourses || selectedCourses.length === 0}
                  />
                  {(!selectedCourses || selectedCourses.length === 0) && (
                    <Text size="xs" color="dimmed" className={styles.warningText}>
                      Please select a course first to view topics
                    </Text>
                  )}
                </div>
                <Select
                  label={renderLabelWithTooltip("Resource Type", "Filter by the category of resource (Exercise, Notes, etc.)")}
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
                  label={renderLabelWithTooltip("Material Type", "Filter by whether the resource is a file or external link")}
                  data={[
                    { value: 'file', label: 'File' },
                    { value: 'link', label: 'Link' },
                  ]}
                  onChange={handleMaterialTypeSelect}
                  value={selectedMaterialType || null}
                />
                <MultiSelect
                  label={renderLabelWithTooltip("Contributor", "Filter resources by the person who created them")}
                  data={contributorsData?.map((contributor) => ({
                    value: trimCapitalizeFirstLetter(contributor.name), 
                    label: trimCapitalizeFirstLetter(contributor.name)
                  }))}
                  value={selectedContributors || []}
                  onChange={handleContributorsSelect}
                  searchable
                />
              </div>
            </div>

          <div className={styles.resourcesColumn}>
            <ResourcesListPaginated data={filteredData} />
          </div>
        </div>
      }
    </>
  );
};