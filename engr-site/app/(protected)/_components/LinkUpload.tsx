"use client";
import { useState, ChangeEvent } from "react";


import { createTagPostLink } from "@/actions/uploadingPostTags/uploadTagsAction";

// import { createTagPost, getSignedURL } from "@/config/action";
// import { DropzoneButton, ButtonProgress } from "../../components/mantine";
// import { MantineProvider, TagsInput } from "@mantine/core";

// import styles from '@/styles/test.module.css'
import Tags from "./Tags";
import styles from "@/styles/test.module.css";
import { SelectDropdown } from "@/components/mantine";
import { fetchModulesByCourse } from "@/actions/fetching/fetchModulesByCourse";
import { fetchSectionsByModule } from "@/actions/fetching/fetchSectionsByModule";
import { FormattedData, capitalizeAndReplaceDash, capitalizeWords } from "@/utils/formatting";
import { fetchConceptsBySectionId } from "@/actions/fetching/fetchConceptsBySectionId";
import { uploadLink } from "@/actions/uploadingPostTags/uploadLink";
import { sanitizeUrl, trimCapitalizeFirstLetter, validUrlPattern } from "@/utils/helpers";


type Options = {
  value: string | null;
  id: number | null;
  formatted: string | null;
};

type LinkUploadProps = {
  coursesOptionsData: FormattedData[] | undefined;
};

export const LinkUpload = ({ coursesOptionsData }: LinkUploadProps) => {
  console.log("data: ", coursesOptionsData);
  //* state for form
  const [linkName, setLinkName] = useState("");
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


  const handleLinkUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value
    setLinkUrl(inputUrl)
    
    const pattern = validUrlPattern
    console.log("-testing: ", pattern.test(inputUrl))

    setIsValidUrl(pattern.test(inputUrl))
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    console.log({ tags, linkName, linkUrl });
    try {
      if (linkName === "" || linkUrl === "") {
        setStatusMessage("no linkUrl or linkName inputted");
        setLoading(false);
        console.error("error");
        return;
      }

      //* checking if url matches url pattern
      const pattern = validUrlPattern
      if (!pattern.test(linkUrl)) {
        setStatusMessage("Invalid url")
        return
      }

      setStatusMessage("uploading link");

      const date = new Date();
      const currentDateWithoutTime = date.toISOString().slice(0, 10);
      console.log(currentDateWithoutTime);

      const formattedDescription = trimCapitalizeFirstLetter(description)
      const formattedContributor = trimCapitalizeFirstLetter(contributor)
      console.log(formattedDescription)
      console.log(formattedContributor)


      setLinkName((link) => link.trim());
      const formattedLinkName = capitalizeAndReplaceDash(linkName)
      console.log(formattedLinkName)
    

      setLinkUrl((link) => link.trim());
      const sanitizedUrl = sanitizeUrl(linkUrl)
      if (sanitizedUrl !== linkUrl || sanitizedUrl.includes('<') || sanitizedUrl.includes('>')) {
        setStatusMessage("URL was altered during sanitization. Not storing in database")
        return
      }

      const linkResult = await uploadLink({
        linkName: formattedLinkName,
        linkUrl: sanitizedUrl,
        conceptId: selectedConceptOption.id!,
        description: formattedDescription.length > 0 ? formattedDescription : null,
        contributor: formattedContributor.length > 0 ? formattedContributor : "Anonymous",
        uploadDate: currentDateWithoutTime!,
      });
      // const signedURLResult = await getSignedURL()

      if (linkResult?.failure) {
        setStatusMessage("Failed" + linkResult?.failure);
        setLoading(false);
        throw new Error(linkResult.failure);
      }

      //* success insert signedUrl into db
      //* url to put to S3 now
      if (linkResult?.success) {
        const { linkId } = linkResult?.success;
        console.log("success in link: ", linkId);

        const trimmedTags = tags
          .map((tag) => {
            const capWords = capitalizeWords(tag.trim())
            console.log("capWords: ", capWords)
            return capWords
          })
          .filter((tag) => tag !== "");

        if (trimmedTags && trimmedTags.length > 0) {
          const tagsResult = await createTagPostLink(trimmedTags, linkId);

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
      console.error("Error during link upload:", error);
      setStatusMessage("failed");
    } finally {
      setLoading(false);
    }
  };

  console.log("link: ", linkName, linkUrl);
  console.log(
    selectedCourseOption.formatted,
    selectedModuleOption.formatted,
    selectedSectionOption.formatted
  );

  console.log("valid url: ", isValidUrl)

  

  return (
    <div>
      {/* <MantineProvider>  */}
      <form onSubmit={handleSubmit}>
        {statusMessage && (
          <p className={styles.messageStyle}> {statusMessage} </p>
        )}

        <p> Input linkName </p>
        <input type="text" onChange={(e) => setLinkName(e.target.value)} />

        <p> Input linkUrl </p>
        <input 
          type="text" 
          onChange={handleLinkUrlChange} 
          style={{borderColor: isValidUrl ? "green": "red"}}
        />

        <button
          type="submit"
          // disable={linkUrl != undefined ? true : false}
        >
          Upload
        </button>

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
          onChange={(e) => setDescription(e.target.value)}
        />

        <h4> Add contributor </h4>
        <input
          type="text"
          name="description"
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
