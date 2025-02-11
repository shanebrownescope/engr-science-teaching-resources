"use client";
import { useState, ChangeEvent } from "react";

import { getSignedURL } from "@/actions/uploadingPostTags/getSignedUrl";
import { createTagPostFile } from "@/actions/uploadingPostTags/uploadTagsAction";

// import styles from '@/styles/test.module.css'
import Tags from "./tags/Tags";
// import styles from "@/styles/test.module.css";
import { ButtonProgress, SelectDropdown } from "@/components/mantine";
import { FormattedData, capitalizeWords } from "@/utils/formatting";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useRouter } from "next/navigation";
import { FormError } from "@/components/FormError";
import styles from "@/styles/form.module.css";
import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";
import { fetchResourceTypesByCourseTopicId } from "@/actions/fetching/resourceType/fetchResourceTypesByCourseTopicId";
import { fetchConceptsByResourceTypeId } from "@/actions/fetching/concepts/fetchConceptsByResourceTypeId";

//* Testing: file upload to s3 and db
//* TestDb component: test db is working

type Options = {
  value: string | null;
  id: number | null;
  formatted: string | null;
};

type FileUploadProps = {
  coursesOptionsData: FormattedData[] | undefined;
};

type FormErrorsFileUpload = {
  root?: string;
  fileName?: string;
  file?: string;
  courseName?: string;
  courseTopicName?: string;
  resourceTypeName?: string;
  conceptName?: string;
  conceptId?: string;
};

export const FileUpload = ({ coursesOptionsData }: FileUploadProps) => {
  const router = useRouter();
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
  console.log("data: ", coursesOptionsData);
  //* state for form
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState([""]);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
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

  const [errors, setErrors] = useState<FormErrorsFileUpload>({
    fileName: undefined,
    file: undefined,
    courseName: undefined,
    courseTopicName: undefined,
    resourceTypeName: undefined,
    conceptName: undefined,
    conceptId: undefined,
  });
  const errorMessages: { [key: string]: string } = {
    root: "Please fill out all required fields.",
    fileName: "File name is required.",
    file: "File is required.",
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


<<<<<<< HEAD
    setResourceTypeOptionsData(results.success);
=======
    setResourceTypeOptionsData([
        // ...(results.success as any),
        { value: "Problems/Exercises", id: "Problems/Exercises", formatted: "Problems/Exercises" },
        { value: "Course Notes", id: "Course Notes", formatted: "Course Notes" },
        { value: "Video/Interactive Content", id: "Video/Interactive Content", formatted: "Video/Interactive Content" }
    ]);
>>>>>>> parent of cf890e3 (Update FileUpload.tsx)
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

  //* WebCrypto API
  //* hash file and turn into string
  //* used to make sure file doesn't change
  const computeSHA256 = async (file: File) => {
    // Convert file content to array buffer
    const buffer = await file.arrayBuffer();

    // Calculate SHA-256 hash of buffer
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    // Convert ArrayBuffer to array of bytes (hashArray)
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert each byte to hexadecimal string and pad it with leading zeros to ensure the string is two characters long
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    // Return the hexadecimal SHA-256 hash
    return hashHex;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("-- how many");

    setLoading(true);

    console.log({ tags, file });
    setStatusMessage("validating input");

    if (
      !fileName ||
      !file ||
      !selectedCourseOption.value ||
      !selectedCourseTopicOption.value ||
      !selectedResourceTypeOption.value ||
      !selectedConceptOption.value
    ) {
      const errors = {
        root: errorMessages.root,
        fileName: !fileName ? errorMessages.fileName : undefined,
        file: !file ? errorMessages.file : undefined,
        courseName: !selectedCourseOption.value
          ? errorMessages.courseId
          : undefined,
        courseTopic: !selectedCourseTopicOption.value
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
      setLoading(false);
      return;
    }

    setErrors({
      fileName: undefined,
      file: undefined,
      courseName: undefined,
      courseTopicName: undefined,
      resourceTypeName: undefined,
      conceptName: undefined,
      conceptId: undefined,
    });

    const date = new Date();
    const currentDateWithoutTime = date.toISOString().slice(0, 10);
    console.log(currentDateWithoutTime);

    const formattedDescription = trimCapitalizeFirstLetter(description);
    const formattedContributor = trimCapitalizeFirstLetter(contributor);
    console.log(formattedDescription);
    console.log(formattedContributor);
    console.log("-- how many times");

    try {
      setStatusMessage("uploading file");

      console.log("-- how many times will this show");

      const checksum = await computeSHA256(file);
      const signedURLResult = await getSignedURL({
        fileName: fileName.trim(),
        fileType: file!.type,
        fileSize: file!.size,
        checksum: checksum,
        course: selectedCourseOption.formatted!,
        courseTopic: selectedCourseTopicOption.formatted!,
        resourceType: selectedResourceTypeOption.formatted!,
        concept: selectedConceptOption.formatted!,
        conceptId: selectedConceptOption.id!,
        description:
          formattedDescription.length > 0 ? formattedDescription : null,
        contributor:
          formattedContributor.length > 0 ? formattedContributor : "Anonymous",
        uploadDate: currentDateWithoutTime!,
      });
      // const signedURLResult = await getSignedURL()

      if (signedURLResult?.failure) {
        setStatusMessage("Failed" + signedURLResult?.failure);
        setErrors({ ...errors, root: signedURLResult?.failure });
        throw new Error(signedURLResult.failure);
      }

      //* success insert signedUrl into db
      //* url to put to S3 now
      if (signedURLResult?.success) {
        const { url, fileId } = signedURLResult?.success;
        console.log("success in getSignedURL, url: ", url, "fileId: ", fileId);

        //* upload file using the signed url
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        // Filter out empty tags first, then format the remaining tags
        const trimmedTags = tags
          .filter((tag) => tag.trim() !== "") // Filter out empty tags
          .map((tag) => capitalizeWords(tag.trim())); // Format the remaining tags

        console.log(" -- trimmed tags: ", trimmedTags);

        if (trimmedTags && trimmedTags.length > 0) {
          const tagsResult = await createTagPostFile(trimmedTags, fileId);

          if (tagsResult?.failure) {
            setStatusMessage("Failed in tag insertion" + tagsResult.failure);
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
      console.error("Error during file upload:", error);
      setErrors({ ...errors, root: error as string });
      setStatusMessage("failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //* in browser, get url
    const file = e.target.files?.[0];
    setFile(file);

    //* existing fileUrl, delete
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      console.log("==url: ", url);
      setFileUrl(url);
    } else {
      setFileUrl(undefined);
    }
  };

  console.log("file name: ", file && file.name);
  console.log(
    selectedCourseOption.formatted,
    selectedCourseTopicOption.formatted,
    selectedResourceTypeOption.formatted,
  );

  console.log("get file: ", file);
  console.log("get file url: ", fileUrl);

  return (
    <div className={styles.formAdminWrapper}>
      <p className={styles.formAdminTitle}> Upload file </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {statusMessage && (
          <p className={styles.messageStyle}> {statusMessage} </p>
        )}

        <div>
          <label> Select file </label>
          <input
            type="file"
            accept="pdf"
            disabled={loading}
            onChange={handleFileChange}
          />
          {fileUrl && file && (
            <div>
              <iframe src={fileUrl} />

              <button
                type="button"
                onClick={() => {
                  setFile(undefined);
                  setFileUrl(undefined);
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        {errors.file && <p className="error">{errors.file}</p>}

        <div className="flex-col">
          <label> Enter file name </label>
          <input
            className={errors.fileName && "input-error"}
            type="text"
            placeholder="Enter file name"
            max={100}
            name="fileName"
            value={fileName}
            disabled={loading}
            onChange={(e) => setFileName(e.target.value)}
          />
          {errors.fileName && <p className="error">{errors.fileName}</p>}
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
            <p className="error">{errors.courseName}</p>
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

        <div>
          <label> Select a concept </label>
          <SelectDropdown
            optionsList={conceptOptionsData}
            onOptionChange={handleConceptOptionSelect}
            selectedValue={selectedConceptOption.value}
          />
          {errors.conceptName && <p className="error">{errors.conceptName}</p>}
        </div>

        <div className="flex-col">
          <label> Add Description </label>
          <input
            type="text"
            name="description"
            value={description}
            placeholder="Enter description"
            disabled={loading}
            onChange={(e) => setDescription(e.target.value)}
          />
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
          className={`${styles.formButton}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
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
