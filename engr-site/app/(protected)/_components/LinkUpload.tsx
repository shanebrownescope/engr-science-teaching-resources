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
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { FormError } from "@/components/FormError";


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
  linkName?: string;
  linkUrl?: string;
  courseName?: string;
  moduleName?: string;
  sectionName?: string;
  conceptName?: string;
  conceptId?: string;
};

export const LinkUpload = ({ coursesOptionsData }: LinkUploadProps) => {
  console.log("data: ", coursesOptionsData);
  const router = useRouter()
  const role = useCurrentRole()
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }
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
  const [moduleOptionsData, setModuleOptionsData] = useState<any[]>();
  const [selectedModuleOption, setSelectedModuleOption] = useState<Options>({
    value: null,
    id: null,
    formatted: null,
  });
  const [sectionOptionsData, setSectionOptionsData] = useState<any[]>();
  const [selectedSectionOption, setSelectedSectionOption] = useState<Options>({
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
    linkName: undefined,
    linkUrl: undefined,
    courseName: undefined,
    moduleName: undefined,
    sectionName:undefined,
    conceptName:undefined,
    conceptId: undefined,
  });
  const errorMessages: { [key: string]: string } = {
    root: "Please fill out all required fields.",
    linkName: 'Link name is required.',
    linkUrl: "Link Url is required.",
    courseId: 'Please select a course.',
    moduleId: 'Please select a module.',
    sectionId: 'Please select a section.',
    conceptId: 'Please select a concept.',
  };




  console.log(selectedCourseOption);

  const handleCourseOptionSelect = async (
    value: string,
    id: number,
    formatted: string
  ) => {
    setSelectedModuleOption({ value: null, id: null, formatted: null });
    setSelectedSectionOption({ value: null, id: null, formatted: null });
    setSectionOptionsData([]);
    setSelectedConceptOption({ value: null, id: null, formatted: null });
    setConceptOptionData([]);
    

    setSelectedCourseOption({ value: value, id: id, formatted: formatted });

    const results = await fetchModulesByCourse(value);
    setModuleOptionsData(results.success);
  };

  const handleModuleOptionSelect = async (
    value: string,
    id: number,
    formatted: string
  ) => {
    setSelectedSectionOption({ value: null, id: null, formatted: null });
    setSectionOptionsData([]);
    setSelectedConceptOption({ value: null, id: null, formatted: null });
    setConceptOptionData([]);

    setSelectedModuleOption({ value: value, id: id, formatted: formatted });

    const results = await fetchSectionsByModule({ id: id.toString()  });
    setSectionOptionsData(results.success);
  };

  console.log(moduleOptionsData);


  const handleSectionOptionSelect = async (
    value: string,
    id: number,
    formatted: string
  ) => {
    setSelectedConceptOption({ value: null, id: null, formatted: null });
    setConceptOptionData([]);

    setSelectedSectionOption({ value: value, id: id, formatted: formatted });

    const results = await fetchConceptsBySectionId({ id: id });
    setConceptOptionData(results.success);
  };


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
      if (!linkName || !linkUrl || !selectedCourseOption.value || !selectedModuleOption.value || !selectedSectionOption.value || !selectedConceptOption.value) {
        // Handle validation failure
        console.error('Validation failed: Some fields are empty');
        // Set custom error messages based on the failed validation conditions
        const errors = {
          root: errorMessages.root,
          linkName: !linkName ? errorMessages.linkName : undefined,
          linkUrl: !linkUrl ? errorMessages.linkUrl : undefined,
          courseName: !selectedCourseOption.value ? errorMessages.courseId : undefined,
          moduleName: !selectedModuleOption.value ? errorMessages.moduleId : undefined,
          sectionName: !selectedSectionOption.value ? errorMessages.sectionId : undefined,
          conceptName: !selectedConceptOption.value ? errorMessages.conceptId : undefined,
        };
        setErrors(errors)
        setStatusMessage("validation failed")
        return
      }

      //* checking if url matches url pattern
      const pattern = validUrlPattern
      if (!pattern.test(linkUrl)) {
        setStatusMessage("Invalid url")
        setErrors({...errors, linkUrl: errors.linkUrl})
        return
      }

      setErrors({
        linkName: undefined,
        linkUrl: undefined,
        courseName: undefined,
        moduleName: undefined,
        sectionName: undefined,
        conceptName: undefined,
        conceptId: undefined,
      });

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
        setErrors({ ...errors, root: linkResult?.failure });
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
        {errors.linkName && <p className="error">{errors.linkName}</p>}

        
        <p> Input linkUrl </p>
        <input 
          type="text" 
          onChange={handleLinkUrlChange} 
          style={{borderColor: isValidUrl ? "green": "red"}}
        />
        {errors.linkUrl && <p className="error">{errors.linkUrl}</p>}

        <h4> Select a course </h4>
        <SelectDropdown
          optionsList={coursesOptionsData}
          onOptionChange={handleCourseOptionSelect}
          selectedValue={selectedCourseOption.value}
        />
        {errors.courseName && <p className="error">{errors.courseName}</p>}


        <h4> Select a module </h4>
        {
          <SelectDropdown
            optionsList={moduleOptionsData}
            onOptionChange={handleModuleOptionSelect}
            selectedValue={selectedModuleOption.value}
          />
        }
        {errors.moduleName && <p className="error">{errors.moduleName}</p>}


        <h4> Select a section </h4>
        <SelectDropdown
          optionsList={sectionOptionsData}
          onOptionChange={handleSectionOptionSelect}
          selectedValue={selectedSectionOption.value}
        />
        {errors.sectionName && <p className="error">{errors.sectionName}</p>}


        <h4> Select a concept </h4>
        <SelectDropdown
          optionsList={conceptOptionsData}
          onOptionChange={handleConceptOptionSelect}
          selectedValue={selectedConceptOption.value}
        />
        {errors.conceptName && <p className="error">{errors.conceptName}</p>}


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
        <button
          type="submit"
          // disable={linkUrl != undefined ? true : false}
        >
          Upload
        </button>
        {errors.root && <FormError message={errors.root} />}

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
