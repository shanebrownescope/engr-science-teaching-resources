"use client";
import { useState, ChangeEvent } from "react";

import { createTagPostLink } from "@/actions/uploadingPostTags/uploadTagsAction";

// import { createTagPost, getSignedURL } from "@/config/action";
// import { DropzoneButton, ButtonProgress } from "../../components/mantine";

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
import { fetchResourceTypesByCourseTopicId } from "@/actions/fetching/resourceType/fetchResourceTypesByCourseTopicId";
import { fetchConceptsByResourceTypeId } from "@/actions/fetching/concepts/fetchConceptsByResourceTypeId";

type Options = {
  value: string | null;
  id: number | null;
  formatted: string | null;
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
    value: null,
    id: null,
    formatted: null,
  });
  const [courseTopicOptionsData, setCourseTopicOptionsData] = useState<any[]>();
  const [selectedCourseTopicOption, setSelectedCourseTopicOption] =
    useState<Options>({
      value: null,
      id: null,
      formatted: null,
    });
  const [resourceTypeOptionsData, setResourceTypeOptionsData] =
    useState<any[]>();
  const [selectedResourceTypeOption, setSelectedResourceTypeOption] =
    useState<Options>({
      value: null,
      id: null,
      formatted: null,
    });
  const [conceptOptionsData, setConceptOptionData] = useState<any[]>();
  const [selectedConceptOption, setSelectedConceptOption] = useState<Options>({
    value: null,
    id: null,
    formatted: null,
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

  const handleCourseOptionSelect = async (
    name: string,
    id: number,
    formatted: string,
  ) => {
    setSelectedCourseTopicOption({ value: null, id: null, formatted: null });
    setSelectedResourceTypeOption({ value: null, id: null, formatted: null });
    setResourceTypeOptionsData([]);
    setSelectedConceptOption({ value: null, id: null, formatted: null });
    setConceptOptionData([]);

    setSelectedCourseOption({ value: name, id: id, formatted: formatted });

    const results = await fetchCourseTopicsByCourseId(id);

    setCourseTopicOptionsData(results.success);
  };

  const handleCourseTopicOptionSelect = async (
    value: string,
    id: number,
    formatted: string,
  ) => {
    setSelectedResourceTypeOption({ value: null, id: null, formatted: null });
    setResourceTypeOptionsData([]);
    setSelectedConceptOption({ value: null, id: null, formatted: null });
    setConceptOptionData([]);

    setSelectedCourseTopicOption({
      value: value,
      id: id,
      formatted: formatted,
    });

    const results = await fetchResourceTypesByCourseTopicId(id);

    setResourceTypeOptionsData(results.success);
  };

  const handleResourceTypeOptionSelect = async (
    value: string,
    id: number,
    formatted: string,
  ) => {
    setSelectedConceptOption({ value: null, id: null, formatted: null });
    setConceptOptionData([]);

    setSelectedResourceTypeOption({
      value: value,
      id: id,
      formatted: formatted,
    });

    const results = await fetchConceptsByResourceTypeId(id);

    setConceptOptionData(results.success);
  };

  const handleConceptOptionSelect = (
    value: string,
    id: number,
    formatted: string,
  ) => {
    setSelectedConceptOption({ value: value, id: id, formatted: formatted });
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
        !selectedCourseOption.value ||
        !selectedCourseTopicOption.value ||
        !selectedResourceTypeOption.value ||
        !selectedConceptOption.value
      ) {
        // Handle validation failure
        console.error("Validation failed: Some fields are empty");
        // Set custom error messages based on the failed validation conditions
        const errors = {
          root: errorMessages.root,
          linkUrl: !linkUrl ? errorMessages.linkUrl : undefined,
          courseName: !selectedCourseOption.value
            ? errorMessages.courseId
            : undefined,
          courseTopicName: !selectedCourseTopicOption.value
            ? errorMessages.moduleId
            : undefined,
          resourceTypeName: !selectedResourceTypeOption.value
            ? errorMessages.sectionId
            : undefined,
          conceptName: !selectedConceptOption.value
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
        conceptId: selectedConceptOption.id!,
        description:
          formattedDescription.length > 0 ? formattedDescription : null,
        contributor:
          formattedContributor.length > 0 ? formattedContributor : "Anonymous",
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
    selectedCourseOption.formatted,
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
          <label> Select a course </label>
          <SelectDropdown
            optionsList={coursesOptionsData}
            onOptionChange={handleCourseOptionSelect}
            selectedValue={selectedCourseOption.value}
          />
          {errors.courseName && <p className="error">{errors.courseName}</p>}
        </div>

        <div>
          <label> Select a course topic </label>
          {
            <SelectDropdown
              optionsList={courseTopicOptionsData}
              onOptionChange={handleCourseTopicOptionSelect}
              selectedValue={selectedCourseTopicOption.value}
            />
          }
          {errors.courseTopicName && (
            <p className="error">{errors.courseTopicName}</p>
          )}
        </div>

        <div>
          <label> Select a resource type </label>
          <SelectDropdown
            optionsList={resourceTypeOptionsData}
            onOptionChange={handleResourceTypeOptionSelect}
            selectedValue={selectedResourceTypeOption.value}
          />
          {errors.resourceTypeName && (
            <p className="error">{errors.resourceTypeName}</p>
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
