"use client";
import { useState, ChangeEvent } from "react";

import { getSignedURL } from "@/actions/uploadingPostTags/getSignedUrl";
import { createTagPostFile } from "@/actions/uploadingPostTags/uploadTagsAction";
import { UploadFileAndTagsSchema } from "@/schemas";

// import { createTagPost, getSignedURL } from "@/config/action";
// import { DropzoneButton, ButtonProgress } from "../../components/mantine";
// import { MantineProvider, TagsInput } from "@mantine/core";

import Select from "react-select";

// import styles from '@/styles/test.module.css'
import Tags from "./Tags";
import styles from "@/styles/test.module.css";
import { SelectDropdown } from "@/components/mantine";
import { fetchModulesByCourse } from "@/actions/fetching/fetchModulesByCourse";
import { fetchSectionsByModule } from "@/actions/fetching/fetchSectionsByModule";
import { FormattedData, capitalizeWords } from "@/utils/formatting";
import { fetchConceptsBySectionId } from "@/actions/fetching/fetchConceptsBySectionId";
import { trimCapitalizeFirstLetter } from "@/utils/helpers";

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

export const FileUpload = ({ coursesOptionsData }: FileUploadProps) => {
  console.log("data: ", coursesOptionsData);
  //* state for form
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState([""]);

  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
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
  console.log(selectedCourseOption);

  const handleCourseOptionSelect = (
    value: string,
    id: number,
    formatted: string
  ) => {
    setSelectedCourseOption({ value: value, id: id, formatted: formatted });

    fetchModulesByCourse(value).then((data) => {
      console.log(data.success);
      setModuleOptionsData(data.success);
    });
  };

  const [moduleOptionsData, setModuleOptionsData] = useState<any[]>();
  const [selectedModuleOption, setSelectedModuleOption] = useState<Options>({
    value: null,
    id: null,
    formatted: null,
  });
  const handleModuleOptionSelect = (
    value: string,
    id: number,
    formatted: string
  ) => {
    setSelectedModuleOption({ value: value, id: id, formatted: formatted });

    fetchSectionsByModule({ id: id.toString() }).then((data) => {
      console.log(data.success);
      setSectionOptionsData(data.success);
    });
  };

  console.log(moduleOptionsData);

  const [sectionOptionsData, setSectionOptionsData] = useState<any[]>();
  const [selectedSectionOption, setSelectedSectionOption] = useState<Options>({
    value: null,
    id: null,
    formatted: null,
  });
  const handleSectionOptionSelect = (
    value: string,
    id: number,
    formatted: string
  ) => {
    setSelectedSectionOption({ value: value, id: id, formatted: formatted });

    fetchConceptsBySectionId({ id: id }).then((data: any) => {
      console.log(data.success);
      setConceptOptionData(data.success);
    });
  };

  const [conceptOptionsData, setConceptOptionData] = useState<any[]>();
  const [selectedConceptOption, setSelectedConceptOption] = useState<Options>({
    value: null,
    id: null,
    formatted: null,
  });
  const handleConceptOptionSelect = (
    value: string,
    id: number,
    formatted: string
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

    setLoading(true);
    console.log({ tags, file });
    try {
      if (!file) {
        setStatusMessage("no file selected");
        setLoading(false);
        console.error("error");
        return;
      }

      setStatusMessage("uploading file");

      const date = new Date();
      const currentDateWithoutTime = date.toISOString().slice(0, 10);
      console.log(currentDateWithoutTime);

      const formattedDescription = trimCapitalizeFirstLetter(description)
      const formattedContributor = trimCapitalizeFirstLetter(contributor)
      console.log(formattedDescription)
      console.log(formattedContributor)

      


      const checksum = await computeSHA256(file);
      const signedURLResult = await getSignedURL({
        fileName: fileName.trim(),
        fileType: file!.type,
        fileSize: file!.size,
        checksum: checksum,
        course: selectedCourseOption.formatted!,
        module: selectedModuleOption.formatted!,
        section: selectedSectionOption.formatted!,
        concept: selectedConceptOption.formatted!,
        conceptId: selectedConceptOption.id!,
        description: formattedDescription.length > 0 ? formattedDescription : null,
        contributor: formattedContributor.length > 0 ? formattedContributor : "Anonymous",
        uploadDate: currentDateWithoutTime!,
      });
      // const signedURLResult = await getSignedURL()

      if (signedURLResult?.failure) {
        setStatusMessage("Failed" + signedURLResult?.failure);
        setLoading(false);
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

        const trimmedTags = tags
          .map((tag) => capitalizeWords(tag.trim()))
          .filter((tag) => tag !== "");

        if (trimmedTags && trimmedTags.length > 0) {
          const tagsResult = await createTagPostFile(trimmedTags, fileId);

          if (tagsResult?.failure) {
            setStatusMessage("Failed in tag insertion" + tagsResult.failure);
            setLoading(false);
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
    selectedModuleOption.formatted,
    selectedSectionOption.formatted
  );

  const date = new Date();
  const currentDateWithoutTime = date.toDateString();
  console.log(currentDateWithoutTime);

  return (
    <div>
      {/* <MantineProvider>  */}
      <form onSubmit={handleSubmit}>
        {statusMessage && (
          <p className={styles.messageStyle}> {statusMessage} </p>
        )}
        <p> Select file </p>
        <input type="file" accept="pdf" onChange={handleFileChange} />
        {fileUrl && file && (
          <div>
            <iframe src={fileUrl} />

            <button
              type="button"
              onClick={() => {
                setFile(undefined);
                // setFileUrl(undefined);
              }}
            >
              Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          // disable={fileUrl != undefined ? true : false}
        >
          Upload
        </button>

        <h4> Enter file name </h4>
        <input
          type="text"
          placeholder="Enter file name"
          max={100}
          name="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)} 
        />

        <h4> Select a course </h4>
        <SelectDropdown
          optionsList={coursesOptionsData}
          onOptionChange={handleCourseOptionSelect}
          selectedValue={selectedCourseOption.value}
        />

        <h4> Select a module </h4>
        {
          <SelectDropdown
            optionsList={moduleOptionsData}
            onOptionChange={handleModuleOptionSelect}
            selectedValue={selectedModuleOption.value}
          />
        }

        <h4> Select a section </h4>
        <SelectDropdown
          optionsList={sectionOptionsData}
          onOptionChange={handleSectionOptionSelect}
          selectedValue={selectedSectionOption.value}
        />

        <h4> Select a concept </h4>
        <SelectDropdown
          optionsList={conceptOptionsData}
          onOptionChange={handleConceptOptionSelect}
          selectedValue={selectedConceptOption.value}
        />

        <h4> Add Description </h4>
        <input
          type="text"
          name="description"
          value={description}
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <h4> Add contributor </h4>
        <input
          type="text"
          name="contributor"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
        />
      </form>
      <Tags
        tags={tags}
        handleAddTag={handleAddTag}
        handleTagChange={handleTagChange}
      />

      {/* <DropzoneButton /> */}
      {/* <ButtonProgress /> */}
      {/* <TagsInput
        style={{ width: "25%", marginLeft: "10px" }}
        label="Press Enter to submit a tag"
        placeholder="Enter tag"
      /> */}
      {/* {error && <div> {error} </div>} */}
      {/* {testDbResult && <div> {testDbResult} </div>} */}
      {/* </MantineProvider> */}
    </div>
  );
};
