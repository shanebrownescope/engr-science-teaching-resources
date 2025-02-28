"use client";
import { useState, ChangeEvent } from "react";

import { createTagPostLink } from "@/actions/uploadingPostTags/uploadTagsAction";

// import { createTagPost, getSignedURL } from "@/config/action";
// import { DropzoneButton, ButtonProgress } from "../../components/mantine";

// import styles from '@/styles/test.module.css'
import Tags from "./tags/Tags";
// import styles from "@/styles/test.module.css";
import { SelectDropdown } from "@/components/mantine";
import { MultiSelect } from "@mantine/core";
import {
  FormattedData,
  capitalizeAndReplaceDash,
  capitalizeWords,
} from "@/utils/formatting";
import { uploadLink } from "@/actions/uploadingPostTags/uploadLink";
import {
  sanitizeUrl,
  trimCapitalizeFirstLetter,
  validUrlPattern,
} from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { FormError } from "@/components/FormError";
import styles from "@/styles/form.module.css";
import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";
import { fetchResourceTypesByCourseTopicId } from "@/actions/fetching/resourceType/fetchResourceTypesByCourseTopicId";
import { fetchConceptsByResourceTypeId } from "@/actions/fetching/concepts/fetchConceptsByResourceTypeId";

type Options = {
  value: string[] | null;
  id: number[] | null;
  formatted: string[] | null;
};

type LinkUploadProps = {
  coursesOptionsData: FormattedData[] | undefined;
};

type FormErrorsLinkUpload = {
  root?: string;
  linkUrl?: string;
  courseName?: string;
  courseTopicName?: string;
  resourceTypeName?: string;
  conceptName?: string;
  conceptId?: string;
};

export const LinkUpload = ({ coursesOptionsData }: LinkUploadProps) => {
  console.log("data: ", coursesOptionsData);
  const router = useRouter();
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
  //* state for form
  const [linkUrl, setLinkUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);

  const [tags, setTags] = useState([""]);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState(null);

  const [description, setDescription] = useState<string>("");
  console.log(description);

  const [contributor, setContributor] = useState("");
  const [selectedCourseOption, setSelectedCourseOption] = useState<Options>({
    value: [],
    id: [],
    formatted: []
  });
  const [courseTopicOptionsData, setCourseTopicOptionsData] = useState<any[]>([]);
  const [selectedCourseTopicOption, setSelectedCourseTopicOption] =
    useState<Options>({
      value: [],
      id: [],
      formatted: []
    });
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<string[]>([]);
  const [resourceTypeOptionsData, setResourceTypeOptionsData] =
    useState<any[]>([]);
  const [selectedResourceTypeOption, setSelectedResourceTypeOption] =
    useState<Options>({
      value: [],
      id: [],
      formatted: []
    });
  const [conceptOptionsData, setConceptOptionData] = useState<any[]>([]);
  const [selectedConceptOption, setSelectedConceptOption] = useState<Options>({
    value: [],
    id: [],
    formatted: []
  });
  const [errors, setErrors] = useState<FormErrorsLinkUpload>({
    linkUrl: undefined,
    courseName: undefined,
    courseTopicName: undefined,
    resourceTypeName: undefined,
    conceptName: undefined,
    conceptId: undefined,
  });
  const errorMessages: { [key: string]: string } = {
    root: "Please fill out all required fields.",
    linkUrl: "Link Url is required.",
    courseId: "Please select a course.",
    courseTopicId: "Please select a module.",
    resourceTypeId: "Please select a section.",
    conceptId: "Please select a concept.",
  };

  console.log(selectedCourseOption);

  const handleCourseChange = async (selected: string[]) => {
    // Reset dependent fields
    setSelectedCourseTopicOption({ value: [], id: [], formatted: [] });
    setSelectedResourceTypeOption({ value: [], id: [], formatted: [] });
    setCourseTopicOptionsData([]);
    setResourceTypeOptionsData([]);
    setSelectedConceptOption({ value: [], id: [], formatted: [] });
    setConceptOptionData([]);

    if (selected.length > 0) {
      // Map the selected course values to their corresponding data
      const selectedIds = selected.map(s => {
        const courseData = coursesOptionsData?.find(c => c.name === s);
        return courseData?.id ?? 0;
      }).filter((id): id is number => typeof id === 'number');

      const selectedFormatted = selected.map(s => {
        const courseData = coursesOptionsData?.find(c => c.name === s);
        return courseData?.url ?? s;
      });

      setSelectedCourseOption({
        value: selected,
        id: selectedIds,
        formatted: selectedFormatted
      });

      // If we have a course id, fetch the course topics
      if (selectedIds.length > 0) {
        const results = await fetchCourseTopicsByCourseId(selectedIds[0]);
        setCourseTopicOptionsData(results.success || []);
      }
    } else {
      setSelectedCourseOption({
        value: [],
        id: [],
        formatted: []
      });
    }
  };

  const handleCourseTopicChange = async (selected: string[]) => {
    // Reset dependent fields
    setSelectedResourceTypeOption({ value: [], id: [], formatted: [] });
    setResourceTypeOptionsData([]);
    setSelectedConceptOption({ value: [], id: [], formatted: [] });
    setConceptOptionData([]);

    if (selected.length > 0) {
      // Convert from the MultiSelect format to our Options format
      const selectedTopicData = courseTopicOptionsData.find(
        topic => topic.name === selected[0]
      );

      if (selectedTopicData) {
        setSelectedCourseTopicOption({
          value: selected,
          id: [selectedTopicData.id],
          formatted: [selectedTopicData.url]
        });

        // Fetch resource types for the selected course topic
        const results = await fetchResourceTypesByCourseTopicId(selectedTopicData.id);

        const mergedResourceTypes = [
          ...(results.success || []),
          { 
            id: 9991, 
            name: 'Problems/Exercises',
            url: 'problems-exercises'
          },
          {
            id: 9992,
            name: 'Course Notes', 
            url: 'course-notes'
          },
          {
            id: 9993,
            name: 'Video/Interactive Content',
            url: 'video-content'
          }
        ];

        setResourceTypeOptionsData(mergedResourceTypes);
      }
    } else {
      setSelectedCourseTopicOption({
        value: [],
        id: [],
        formatted: []
      });
    }
  };

  const handleResourceTypeChange = async (selected: string[]) => {
    // Reset concept data
    setSelectedConceptOption({ value: [], id: [], formatted: [] });
    setConceptOptionData([]);

    if (selected.length > 0) {
      // Convert from the MultiSelect format to our Options format
      const selectedTypeData = resourceTypeOptionsData.find(
        type => type.name === selected[0]
      );

      if (selectedTypeData) {
        setSelectedResourceTypeOption({
          value: selected,
          id: [selectedTypeData.id],
          formatted: [selectedTypeData.url]
        });

        // Fetch concepts for the selected resource type
        const results = await fetchConceptsByResourceTypeId(selectedTypeData.id);
        setConceptOptionData(results.success || []);
      }
    } else {
      setSelectedResourceTypeOption({
        value: [],
        id: [],
        formatted: []
      });
    }
  };

  const handleConceptChange = (selected: string[]) => {
    if (selected.length > 0) {
      // Convert from the MultiSelect format to our Options format
      const selectedConceptData = conceptOptionsData.find(
        concept => concept.name === selected[0]
      );

      if (selectedConceptData) {
        setSelectedConceptOption({
          value: selected,
          id: [selectedConceptData.id],
          formatted: [selectedConceptData.url]
        });
      }
    } else {
      setSelectedConceptOption({
        value: [],
        id: [],
        formatted: []
      });
    }
  };

  const handleAddTag = () => {
    if (tags.length < 5) {
      setTags([...tags, ""]); // Add an empty tag to the array
    }
  };

  const handleTagChange = (index: number, value: string) => {
    console.log("== value: ", value);
    setTags((prevValues) => {
      // Create a copy of the array
      const tagsCopy = [...prevValues];
      // Update the value at the specified index
      tagsCopy[index] = value;
      return tagsCopy;
    });
  };
  console.log("== tags: ", tags);

  const handleRemoveTag = (indexToRemove: number) => {
    setTags((prevTags) => prevTags.filter((_, index) => index !== indexToRemove));
  };

  const handleLinkUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setLinkUrl(inputUrl);

    const pattern = validUrlPattern;
    console.log("-testing: ", pattern.test(inputUrl));

    setIsValidUrl(pattern.test(inputUrl));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    console.log({ tags, linkUrl });
    try {
      if (
        !linkUrl ||
        !selectedCourseOption.value?.length ||
        !selectedCourseTopicOption.value?.length ||
        !selectedResourceTypeOption.value?.length ||
        !selectedConceptOption.value?.length
      ) {
        // Handle validation failure
        console.error("Validation failed: Some fields are empty");
        // Set custom error messages based on the failed validation conditions
        const errors = {
          root: errorMessages.root,
          linkUrl: !linkUrl ? errorMessages.linkUrl : undefined,
          courseName: !selectedCourseOption.value?.length
            ? errorMessages.courseId
            : undefined,
          courseTopicName: !selectedCourseTopicOption.value?.length
            ? errorMessages.moduleId
            : undefined,
          resourceTypeName: !selectedResourceTypeOption.value?.length
            ? errorMessages.sectionId
            : undefined,
          conceptName: !selectedConceptOption.value?.length
            ? errorMessages.conceptId
            : undefined,
        };
        setErrors(errors);
        setStatusMessage("validation failed");
        return;
      }

      //* checking if url matches url pattern
      const pattern = validUrlPattern;
      if (!pattern.test(linkUrl)) {
        setStatusMessage("Invalid url");
        setErrors({ ...errors, linkUrl: errors.linkUrl });
        return;
      }

      setErrors({
        linkUrl: undefined,
        courseName: undefined,
        courseTopicName: undefined,
        resourceTypeName: undefined,
        conceptName: undefined,
        conceptId: undefined,
      });

      setStatusMessage("uploading link");

      const date = new Date();
      const currentDateWithoutTime = date.toISOString().slice(0, 10);
      console.log(currentDateWithoutTime);

      const formattedDescription = trimCapitalizeFirstLetter(description);
      const formattedContributor = trimCapitalizeFirstLetter(contributor);
      console.log(formattedDescription);
      console.log(formattedContributor);

      setLinkUrl((link) => link.trim());
      const sanitizedUrl = sanitizeUrl(linkUrl);
      if (
        sanitizedUrl !== linkUrl ||
        sanitizedUrl.includes("<") ||
        sanitizedUrl.includes(">")
      ) {
        setStatusMessage(
          "URL was altered during sanitization. Not storing in database",
        );
        return;
      }

      const linkResult = await uploadLink({
        linkUrl: sanitizedUrl,
        linkName: selectedConceptOption.formatted![0],
        conceptId: selectedConceptOption.id![0],
        description: formattedDescription.length > 0 ? formattedDescription : null,
        contributor: formattedContributor.length > 0 ? formattedContributor : "Anonymous",
        uploadDate: currentDateWithoutTime!,
      });
      // const signedURLResult = await getSignedURL()

      if (linkResult?.failure) {
        setStatusMessage("Failed" + linkResult?.failure);
        setLoading(false);
        setErrors({ ...errors, root: linkResult?.failure });
        throw new Error(linkResult.failure);
      }

      //* success insert signedUrl into db
      //* url to put to S3 now
      if (linkResult?.success) {
        const { linkId } = linkResult?.success;
        console.log("success in link: ", linkId);

        // Filter out empty tags first, then format the remaining tags
        const trimmedTags = tags
          .filter((tag) => tag.trim() !== "") // Filter out empty tags
          .map((tag) => capitalizeWords(tag.trim())); // Format the remaining tags

        if (trimmedTags && trimmedTags.length > 0) {
          const tagsResult = await createTagPostLink(trimmedTags, linkId);

          if (tagsResult?.failure) {
            setStatusMessage("Failed in tag insertion" + tagsResult.failure);
            setLoading(false);
            setErrors({ ...errors, root: tagsResult?.failure });
            throw new Error(tagsResult.failure);
          }

          if (tagsResult?.success) {
            console.log("-- tag result: ", tagsResult?.success);
          }
        } else {
          console.log(" -- no tags");
        }

        setStatusMessage("successful uploaded, created");
      }
    } catch (error) {
      console.error("Error during link upload:", error);
      setStatusMessage("failed");
    } finally {
      setLoading(false);
    }
  };

  console.log(
    selectedCourseOption.formatted,
    selectedCourseTopicOption.formatted,
    selectedResourceTypeOption.formatted,
  );

  console.log("valid url: ", isValidUrl);

  return (
    <div className={styles.formAdminWrapper}>
      <p className={styles.formAdminTitle}> Link Upload </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {statusMessage && (
          <p className={styles.messageStyle}> {statusMessage} </p>
        )}

        <div className="flex-col">
          <label> Input linkUrl </label>
          <input
            className={errors.linkUrl && "input-error"}
            type="text"
            onChange={handleLinkUrlChange}
            disabled={loading}
            style={{ borderColor: isValidUrl ? "green" : "red" }}
          />
          {errors.linkUrl && <p className="error">{errors.linkUrl}</p>}
        </div>

        <div>
          <label>Select a course</label>
          <MultiSelect
            data={coursesOptionsData?.map(course => ({ 
              value: course.name, 
              label: course.name 
            })) || []}
            value={selectedCourseOption.value || []}
            onChange={handleCourseChange}
            placeholder="Select one or more courses"
            searchable
          />
          {errors.courseName && <p className="error">{errors.courseName}</p>}
        </div>

        <div>
          <label>Select a course topic</label>
          <MultiSelect
            data={courseTopicOptionsData?.map(topic => ({ 
              value: topic.name, 
              label: topic.name 
            })) || []}
            value={selectedCourseTopicOption.value || []}
            onChange={handleCourseTopicChange}
            placeholder="Select a course topic"
            searchable
            disabled={!selectedCourseOption.value?.length}
          />
          {errors.courseTopicName && (
            <p className="error">{errors.courseTopicName}</p>
          )}
        </div>

        <div>
          <label>Select a resource type</label>
          <MultiSelect
            data={resourceTypeOptionsData?.map(type => ({
              value: type.name,
              label: type.name
            })) || []}
            value={selectedResourceTypeOption.value || []}
            onChange={handleResourceTypeChange}
            placeholder="Select a resource type"
            searchable
            disabled={!selectedCourseTopicOption.value?.length}
          />
          {errors.resourceTypeName && (
            <p className="error">{errors.resourceTypeName}</p>
          )}
        </div>

        <div>
          <label>Select a concept</label>
          <MultiSelect
            data={conceptOptionsData?.map(concept => ({
              value: concept.name,
              label: concept.name
            })) || []}
            value={selectedConceptOption.value || []}
            onChange={handleConceptChange}
            placeholder="Select a concept"
            searchable
            disabled={!selectedResourceTypeOption.value?.length}
          />
          {errors.conceptName && <p className="error">{errors.conceptName}</p>}
        </div>

        <div className="flex-col">
          <label> Add contributor </label>
          <input
            type="text"
            name="contributor"
            value={contributor}
            disabled={loading}
            onChange={(e) => setContributor(e.target.value)}
          />
        </div>

        <Tags
          tags={tags}
          loading={loading}
          handleAddTag={handleAddTag}
          handleTagChange={handleTagChange}
          handleRemoveTag={handleRemoveTag} 
        />

        <button
          className={styles.formButton}
          disabled={loading}
          type="submit"
          // disable={linkUrl != undefined ? true : false}
        >
          Upload
        </button>
        {errors.root && <FormError message={errors.root} />}
      </form>

      {/* <DropzoneButton /> */}
      {/* <ButtonProgress /> */}
      {/* <TagsInput
        style={{ width: "25%", marginLeft: "10px" }}
        label="Press Enter to submit a tag"
        placeholder="Enter tag"
      /> */}
      {/* {error && <div> {error} </div>} */}
      {/* {testDbResult && <div> {testDbResult} </div>} */}
    </div>
  );
};