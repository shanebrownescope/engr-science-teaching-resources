"use client";
import { useState, ChangeEvent } from "react";

import { createTagPostLink } from "@/actions/uploadingPostTags/uploadTagsAction";

// import { createTagPost, getSignedURL } from "@/config/action";
// import { DropzoneButton, ButtonProgress } from "../../components/mantine";
import { ComboboxItem, MultiSelect, Select } from "@mantine/core";

// import styles from '@/styles/test.module.css'
import Tags from "./tags/Tags";
// import styles from "@/styles/test.module.css";
import { SelectDropdown } from "@/components/mantine";

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

type LinkUploadProps = {
  coursesOptionsData: FormattedData[] | undefined;
};

type FormErrorsLinkUpload = {
  root?: string;
  linkUrl?: string;
  courses?: string;
  courseTopics?: string;
  resourceType?: string;
};

export const LinkUpload = ({ coursesOptionsData }: LinkUploadProps) => {
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

  const [contributor, setContributor] = useState("");
  const [selectedCoursesOption, setSelectedCoursesOption] = useState<any[]>();
  const [courseTopicsOptionData, setCourseTopicsOptionData] = useState<any[]>();
  const [selectedCourseTopicsOption, setSelectedCourseTopicsOption] = useState<any[]>()
  const [selectedResourceTypeOption, setSelectedResourceTypeOption] = useState<any>();

  const [errors, setErrors] = useState<FormErrorsLinkUpload>({
    linkUrl: undefined,
    courses: undefined,
    courseTopics: undefined,
    resourceType: undefined
  });
  const errorMessages: { [key: string]: string } = {
    root: "Please fill out all required fields.",
    linkUrl: "Link Url is required.",
    courses: "Please select a course.",
    courseTopics: "Please select a course topic.",
    resourceType: "Please select a resource type."
  };

  const handleCoursesOptionSelect = async (value?: string[]) => {
    // Update the selected courses
    setSelectedCoursesOption(value);

    if (!value || value.length === 0) {
      // If no courses are selected, reset the course topics data and selected topics
      setCourseTopicsOptionData([]);
      setSelectedCourseTopicsOption([]);
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
      setCourseTopicsOptionData(combinedCourseTopics);

      // Filter the selected course topics to keep only those associated with the remaining courses
      setSelectedCourseTopicsOption((prevSelectedTopics) => {
        return prevSelectedTopics?.filter((topic) =>
          combinedCourseTopics.some((ct) => ct.id == topic)
        );
      });
    } catch (error) {
      console.error('Error fetching course topics:', error);
      setStatusMessage("Failed to fetch course topics");
      setErrors({ ...errors, root: error as string });
      setCourseTopicsOptionData([]);
      setSelectedCourseTopicsOption([]);
    }
  };

  const handleCourseTopicsOptionSelect = async (value?: string[]) => {
    if (!value || value.length === 0) {
      setSelectedCourseTopicsOption([]);
      return;
    }
    
    setSelectedCourseTopicsOption(value);
  };

  const handleResourceTypeOptionSelect = (value: string | null) => {
    setSelectedResourceTypeOption(value || null);
  };

  const handleAddTag = () => {
    if (tags.length < 3) {
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
        !selectedCoursesOption?.length ||
        !selectedCourseTopicsOption?.length ||
        !selectedResourceTypeOption
      ) {
        // Handle validation failure
        console.error("Validation failed: Some fields are empty");
        // Set custom error messages based on the failed validation conditions
        const errors = {
          root: errorMessages.root,
          linkUrl: !linkUrl ? errorMessages.linkUrl : undefined,
          courses: !selectedCoursesOption?.length
            ? errorMessages.courses : undefined,
          courseTopics: !selectedCourseTopicsOption?.length
            ? errorMessages.courseTopics : undefined,
          resourceType: !selectedResourceTypeOption
            ? errorMessages.resourceType : undefined
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
        courses: undefined,
        courseTopics: undefined,
        resourceType: undefined,
      });

      setStatusMessage("uploading link");

      const date = new Date();
      const currentDateWithoutTime = date.toISOString().slice(0, 10);
      console.log(currentDateWithoutTime);

      const formattedContributor = trimCapitalizeFirstLetter(contributor);
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
        courses: selectedCoursesOption,
        courseTopics: selectedCourseTopicsOption,
        resourceType: selectedResourceTypeOption,
        contributor:
          formattedContributor.length > 0 ? formattedContributor : "Anonymous",
        uploadDate: currentDateWithoutTime!,
      });

      if (linkResult?.failure) {
        console.log("failure in link upload");
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

        // Clear all fields
        setLinkUrl("")
        setSelectedCoursesOption(undefined)
        setCourseTopicsOptionData(undefined)
        setSelectedCourseTopicsOption(undefined)
        setSelectedResourceTypeOption(undefined)
        setContributor("")
        setErrors({
          linkUrl: undefined,
          courses: undefined,
          courseTopics: undefined,
          resourceType: undefined
        })
        setTags([""])
      }
    } catch (error) {
      console.error("Error during link upload:", error);
      setStatusMessage("failed");
    } finally {
      setLoading(false);
    }
  };

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
          <label> Select course(s) </label>
          <MultiSelect
            data={coursesOptionsData?.map((course) => ({
              value: String(course.id), 
              label: course.name
            }))}
            value={selectedCoursesOption || []}
            onChange={handleCoursesOptionSelect}
            searchable
          />
          {errors.courses && (
            <p className="error">{errors.courses}</p>
          )}
        </div>

        <div>
        <label> Select course topic(s) </label>
          <MultiSelect
            data={courseTopicsOptionData?.map((topic) => ({
              value: String(topic.id), 
              label: topic.name
            }))}
            value={selectedCourseTopicsOption || []}
            onChange={handleCourseTopicsOptionSelect}
            searchable
          />
          {errors.courseTopics && (
            <p className="error">{errors.courseTopics}</p>
          )}
        </div>

        <div>
          <label> Select a resource type </label>
          <Select
            data={[
              { value: 'exercise', label: 'Exercise' },
              { value: 'notes', label: 'Notes' },
              { value: 'video', label: 'Video' },
              { value: 'interactive', label: 'Interactive Content' }
            ]}
            onChange={handleResourceTypeOptionSelect}
            value={selectedResourceTypeOption || null}
          />
          {errors.resourceType && (
            <p className="error">{errors.resourceType}</p>
          )}
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
    </div>
  );
};