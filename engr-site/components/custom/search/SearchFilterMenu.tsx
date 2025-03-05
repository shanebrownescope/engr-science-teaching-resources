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

  const [sortBy, setSortBy] = useState<string | null>("");
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

  // Handle filter selection changes
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
        value.map((courseId) => fetchCourseTopicsByCourseId(courseId))
      );
  
      // Combine all the course topics into a single array (flatMap == map + flat)
      const combinedCourseTopics = results.flatMap((result) => result.success || []);
  
      // Update the course topics data state
      setCourseTopicsData(combinedCourseTopics);
  
      // Filter the selected course topics to keep only those associated with the remaining courses
      setSelectedCourseTopics((prevSelectedTopics) => {
        return prevSelectedTopics?.filter((topic) =>
          combinedCourseTopics.some((ct) => ct.id == topic)
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

  const handleContributorsSelect = async (value?: string[]) => {
    if (!value || value.length === 0) {
      setSelectedContributors([]);
      return;
    }
    setSelectedContributors(value);
  };

  // apply filters upon change



  // Function to handle sorting change
  // const handleSortChange = (value: string | null) => {
  //   setSortBy(value);
  // };

  // // Apply sorting based on the selected option
  // let sortedData = resourcesData.slice(); // Create a copy of the data array
  // if (sortBy === "Newest") {
  //   sortedData = resourcesData
  //     .slice()
  //     .sort(
  //       (a, b) =>
  //         new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  //     );
  // } else if (sortBy === "Oldest") {
  //   sortedData = resourcesData
  //     .slice()
  //     .sort(
  //       (a, b) =>
  //         new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
  //     );
  // }

  // console.log(sortedData);

  return (
    <>
      {!isLoading &&
        <div className={styles.filterMenu}>
          <MultiSelect
            label="Tags"
            data={tagsData?.map((tag) => ({
              value: String(tag.id), 
              label: tag.name
            }))}
            value={selectedTags || []}
            onChange={handleTagsSelect}
            searchable
          />
          <MultiSelect
            label="Courses"
            data={coursesData?.map((course) => ({
              value: String(course.id), 
              label: course.name
            }))}
            value={selectedCourses || []}
            onChange={handleCoursesSelect}
            searchable
          />
          <MultiSelect
            label="Course Topics"
            data={courseTopicsData?.map((topic) => ({
              value: String(topic.id), 
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
          <MultiSelect
            label="Contributor"
            data={contributorsData?.map((contributor) => ({
              value: String(contributor.id), 
              label: trimCapitalizeFirstLetter(contributor.name)
            }))}
            value={selectedContributors || []}
            onChange={handleContributorsSelect}
            searchable
          />
        </div>
      }

      <ResourcesListPaginated data={resourcesData} />
    </>
  );
};