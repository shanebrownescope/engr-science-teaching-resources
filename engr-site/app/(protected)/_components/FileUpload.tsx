"use client";
import { useState, ChangeEvent } from "react";
import { getSignedURL } from "@/actions/uploadingPostTags/getSignedUrl";
import { createTagPostFile } from "@/actions/uploadingPostTags/uploadTagsAction";
import { ComboboxItem, MultiSelect, Select } from "@mantine/core";
import { FormError } from "@/components/FormError";
import styles from "@/styles/form.module.css";
import Tags from "./tags/Tags";
import { ButtonProgress, SelectDropdown } from "@/components/mantine";
import { FormattedData, capitalizeWords } from "@/utils/formatting";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useRouter } from "next/navigation";
import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";

//* Testing: file upload to s3 and db
//* TestDb component: test db is working

type FileUploadProps = {
  coursesOptionsData: FormattedData[] | undefined;
};

type FormErrorsFileUpload = {
  root?: string;
  file?: string;
  courses?: string;
  courseTopics?: string;
  resourceType?: string;
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
  const [tags, setTags] = useState([""]);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [contributor, setContributor] = useState("");
  const [selectedCoursesOption, setSelectedCoursesOption] = useState<any[]>();
  const [courseTopicsOptionData, setCourseTopicsOptionData] = useState<any[]>();
  const [selectedCourseTopicsOption, setSelectedCourseTopicsOption] = useState<any[]>()
  const [selectedResourceTypeOption, setSelectedResourceTypeOption] = useState<any>();
  const [errors, setErrors] = useState<FormErrorsFileUpload>({
    file: undefined,
    courses: undefined,
    courseTopics: undefined,
    resourceType: undefined
  });

  const errorMessages: { [key: string]: string } = {
    root: "Please fill out all required fields.",
    file: "File is required.",
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

  //* Tags functionality
  const handleAddTag = () => {
    if (tags.length < 3) {
      setTags([...tags, ""]); // Add an empty tag to the array
    }
  };

  const handleTagChange = (index: number, value: string) => {
    setTags((prevValues) => {
      const tagsCopy = [...prevValues];
      tagsCopy[index] = value;
      return tagsCopy;
    });
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags((prevTags) => prevTags.filter((_, index) => index !== indexToRemove));
  };

  //* WebCrypto API
  //* hash file and turn into string
  //* used to make sure file doesn't change
  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("-- how many");

    setLoading(true);

    console.log({ tags, file });
    setStatusMessage("validating input");

    if (
      !file ||
      !selectedCoursesOption?.length ||
      !selectedCourseTopicsOption?.length ||
      !selectedResourceTypeOption
    ) {
      const errors = {
        root: errorMessages.root,
        file: !file ? errorMessages.file : undefined,
        courses: !selectedCoursesOption?.length
          ? errorMessages.courses : undefined,
        courseTopics: !selectedCourseTopicsOption?.length
          ? errorMessages.courseTopics : undefined,
        resourceType: !selectedResourceTypeOption
          ? errorMessages.resourceType : undefined
      };
      setErrors(errors);

      setStatusMessage("validation failed");
      setLoading(false);
      return;
    }

    setErrors({
      file: undefined,
      courses: undefined,
      courseTopics: undefined,
      resourceType: undefined,
    });

    const date = new Date();
    const currentDateWithoutTime = date.toISOString().slice(0, 10);
    console.log(currentDateWithoutTime);

    const formattedContributor = trimCapitalizeFirstLetter(contributor);
    console.log(formattedContributor);
    console.log("-- how many times");

    try {
      setStatusMessage("uploading file");

      console.log("-- how many times will this show");

      const checksum = await computeSHA256(file);
      const signedURLResult = await getSignedURL({
        fileType: file!.type,
        fileSize: file!.size,
        checksum: checksum,
        courses: selectedCoursesOption,
        courseTopics: selectedCourseTopicsOption,
        resourceType: selectedResourceTypeOption,
        contributor:
          formattedContributor.length > 0 ? formattedContributor : "Anonymous",
        uploadDate: currentDateWithoutTime!,
      });

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

        // Clear all fields
        setFile(undefined)
        setSelectedCoursesOption(undefined)
        setCourseTopicsOptionData(undefined)
        setSelectedCourseTopicsOption(undefined)
        setSelectedResourceTypeOption(undefined)
        setContributor("")
        setErrors({
          file: undefined,
          courses: undefined,
          courseTopics: undefined,
          resourceType: undefined
        })
        setTags([""])
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

  return (
    <div className={styles.formAdminWrapper}>
      <p className={styles.formAdminTitle}> Upload file </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        {statusMessage && <p className={styles.messageStyle}> {statusMessage} </p>}
        <div>
          <label> Select file </label>
          <input type="file" accept="pdf" disabled={loading} onChange={handleFileChange} />
          {fileUrl && file && (
            <div>
              <iframe src={fileUrl} />
              <button type="button" onClick={() => { setFile(undefined); setFileUrl(undefined); }}>
                Remove
              </button>
            </div>
          )}
          {errors.file && <p className="error">{errors.file}</p>}
        </div>

        <div>
          <label>Select course(s)</label>
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

        {/* Tags component */}
        <Tags
          tags={tags}
          loading={loading}
          handleAddTag={handleAddTag}
          handleTagChange={handleTagChange}
          handleRemoveTag={handleRemoveTag}
        />

        <button className={`${styles.formButton}`} type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        {errors.root && <FormError message={errors.root} />}
      </form>

    </div>
  );
};