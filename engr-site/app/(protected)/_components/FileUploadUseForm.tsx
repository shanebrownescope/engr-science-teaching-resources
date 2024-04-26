// "use client";
// import { useState, ChangeEvent, useEffect } from "react";
// import { useForm, SubmitHandler, Controller } from "react-hook-form";


// import { getSignedURL } from "@/actions/uploadingPostTags/getSignedUrl";
// import { createTagPostFile } from "@/actions/uploadingPostTags/uploadTagsAction";


// import Tags from "./Tags";
// import { SelectDropdown } from "@/components/mantine";
// import { fetchModulesByCourse } from "@/actions/fetching/fetchModulesByCourse";
// import { fetchSectionsByModule } from "@/actions/fetching/fetchSectionsByModule";
// import { FormattedData, capitalizeWords } from "@/utils/formatting";
// import { fetchConceptsBySectionId } from "@/actions/fetching/fetchConceptsBySectionId";
// import { trimCapitalizeFirstLetter } from "@/utils/helpers";
// import { useCurrentRole } from "@/hooks/useCurrentRole";
// import { useRouter } from "next/navigation";
// import { FormError } from "@/components/FormError";
// import styles from "@/styles/form.module.css";
// import { FormSelectProps } from "@/utils/types";
// import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";
// import { fetchResourceTypesByCourseTopicId } from "@/actions/fetching/resourceType/fetchResourceTypesByCourseTopicId";
// import { fetchConceptsByResourceTypeId } from "@/actions/fetching/concepts/fetchConceptsByResourceTypeId";
// import { Select } from "@mantine/core";


// //* Testing: file upload to s3 and db
// //* TestDb component: test db is working

// type FileUploadProps = {
//   coursesOptionsData: FormSelectProps[];
// };

// type FormErrorsFileUpload = {
//   root?: string;
//   fileName?: string;
//   file?: string;
//   courseId?: string;
//   courseTopicId?: string;
//   resourceTypeId?: string;
//   conceptId?: string;
// };

// type FormFields = {
//   fileName: string;
//   courseId: string;
//   courseTopicId: string;
//   resourceTypeId: string;
//   conceptId: string;
//   description: string,
//   contributors: string;
// }


// export const FileUploadUseForm = ({ coursesOptionsData }: FileUploadProps) => {
//   const router = useRouter()
//   const role = useCurrentRole()
//   if (role != "admin") {
//     console.log("-- not admin");
//     router.push("/unauthorized");
//   }
//   console.log("data: ", coursesOptionsData);




//   const {
//     control,
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { isSubmitting },
//   } = useForm<FormFields>({
//     defaultValues: {
//       fileName: "",
//       courseId: "",
//       courseTopicId: "",
//       resourceTypeId: "",
//       conceptId: "",
//       description: "",
//       contributors: "",
//     }, 
//   });

//   const [loading, setLoading] = useState(false);

//   //* state for form
//   const [tags, setTags] = useState([""]);
//   const [file, setFile] = useState<File | undefined>(undefined);
//   const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
//   const [statusMessage, setStatusMessage] = useState("");

//   const [courseTopicOptions, setCourseTopicOptions] = useState<FormSelectProps[]>([]);
//   const [resourceTypeOptions, setResourceTypeOptions] = useState<FormSelectProps[]>([]);
//   const [conceptOptions, setConceptOptions] = useState<FormSelectProps[]>([]);

//   const [selectedCourseLabel, setSelectedCourseLabel] = useState("");
//   const [selectedCourseTopicLabel, setSelectedCourseTopicLabel] = useState("");
//   const [selectedResourceTypeLabel, setSelectedResourceTypeLabel] = useState("");
//   const [selectedConceptLabel, setSelectedConceptLabel] = useState("");

//   const handleCourseChange = async (selectedCourseId: string) => {
//     setValue("courseTopicId", ""); 
//     setValue("resourceTypeId", ""); 
//     setValue("conceptId", "")


//     const results = await fetchCourseTopicsByCourseId(selectedCourseId);
//     if (results?.success) {
//       const formattedCourseTopicList = results.success.map((topic: FormattedData) => ({
//         value: topic.id.toString(),
//         label: topic.name,
//       }));
//       setCourseTopicOptions(formattedCourseTopicList);
//     }
//   };

//   const handleCourseTopicChange = async (selectedCourseTopicId: string) => {
//     setValue("resourceTypeId", ""); 
//     setValue("conceptId", "")

//     const results = await fetchResourceTypesByCourseTopicId(
//       selectedCourseTopicId
//     );
//     if (results?.success) {
//       const formattedResourceTypeList = results.success.map((section: FormattedData) => ({
//         value: section.id.toString(),
//         label: section.name,
//       }));
//       setResourceTypeOptions(formattedResourceTypeList);
//     }
//   };

//   const handleResourceTypeChange = async (selectedResourceTypeId: string) => {
//     setValue("conceptId", "")

//     const results = await fetchConceptsByResourceTypeId(
//       selectedResourceTypeId
//     );

//     if (results?.success) {
//       const formattedConceptList = results.success.map((concept: FormattedData) => ({
//         value: concept.id.toString(),
//         label: concept.name,
//       }));
//       setConceptOptions(formattedConceptList);
//     }
//   };





//   const [errors, setErrors] = useState<FormErrorsFileUpload>({
//     fileName: undefined,
//     file: undefined,
//     courseId: undefined,
//     courseTopicId: undefined,
//     resourceTypeId:undefined,
//     conceptId:undefined,
//   });

//   const errorMessages: { [key: string]: string } = {
//     root: "Please fill out all required fields.",
//     fileName: 'File name is required.',
//     file: "File is required.",
//     courseId: 'Please select a course.',
//     courseTopicId: 'Please select a module.',
//     resourceTypeId: 'Please select a section.',
//     conceptId: 'Please select a concept.',
//   };

  


//   const handleAddTag = () => {
//     if (tags.length < 5) {
//       setTags([...tags, ""]); // Add an empty tag to the array
//     }
//   };

//   const handleTagChange = (index: number, value: string) => {
//     console.log("== value: ", value);
//     setTags((prevValues) => {
//       // Create a copy of the array
//       const tagsCopy = [...prevValues];
//       // Update the value at the specified index
//       tagsCopy[index] = value;
//       return tagsCopy;
//     });
//   };
//   console.log("== tags: ", tags);

//   //* WebCrypto API
//   //* hash file and turn into string
//   //* used to make sure file doesn't change
//   const computeSHA256 = async (file: File) => {
//     // Convert file content to array buffer
//     const buffer = await file.arrayBuffer();

//     // Calculate SHA-256 hash of buffer
//     const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

//     // Convert ArrayBuffer to array of bytes (hashArray)
//     const hashArray = Array.from(new Uint8Array(hashBuffer));

//     // Convert each byte to hexadecimal string and pad it with leading zeros to ensure the string is two characters long
//     const hashHex = hashArray
//       .map((byte) => byte.toString(16).padStart(2, "0"))
//       .join("");

//     // Return the hexadecimal SHA-256 hash
//     return hashHex;
//   };



//   const onSubmit: SubmitHandler<FormFields> = async (data) => {
//     const { fileName, courseId, courseTopicId, resourceTypeId, conceptId, description, contributors } = data;

//     setLoading(true);

//     console.log({ tags, file });
//     setStatusMessage("validating input")

//     try {
//       console.error('Validation failed: Some fields are empty');
//       // Set custom error messages based on the failed validation conditions
//       if (!fileName || !file || !courseId || !courseTopicId || !resourceTypeId || !conceptId) {
//         // Handle validation failure
//         console.error('Validation failed: Some fields are empty');
//         // Set custom error messages based on the failed validation conditions
//         const errors = {
//           root: errorMessages.root,
//           fileName: !fileName ? errorMessages.fileName : undefined,
//           file: !file ? errorMessages.file : undefined,
//           courseId: !courseId ? errorMessages.courseId : undefined,
//           courseTopicId: !courseTopicId ? errorMessages.courseTopicId : undefined,
//           resourceTypeId: !resourceTypeId ? errorMessages.resourceTypeId : undefined,
//           conceptId: !conceptId ? errorMessages.conceptId : undefined,
//         };
//         setErrors(errors)
//         setStatusMessage("validation failed")
//         return
//       }

//       setErrors({
//         fileName: undefined,
//         file: undefined,
//         courseId: undefined,
//         courseTopicId: undefined,
//         resourceTypeId: undefined,
//         conceptId: undefined,
//       });
      

//       setStatusMessage("uploading file");

//       const date = new Date();
//       const currentDateWithoutTime = date.toISOString().slice(0, 10);
//       console.log(currentDateWithoutTime);

//       const formattedDescription = trimCapitalizeFirstLetter(description)
//       const formattedContributor = trimCapitalizeFirstLetter(contributors)
//       console.log(formattedDescription)
//       console.log(formattedContributor)

      


//       const checksum = await computeSHA256(file);
//       const signedURLResult = await getSignedURL({
//         fileName: fileName.trim(),
//         fileType: file!.type,
//         fileSize: file!.size,
//         checksum: checksum,
//         course: courseId!,
//         module: selectedModuleOption.formatted!,
//         section: selectedSectionOption.formatted!,
//         concept: selectedConceptOption.formatted!,
//         conceptId: selectedConceptOption.id!,
//         description: formattedDescription.length > 0 ? formattedDescription : null,
//         contributor: formattedContributor.length > 0 ? formattedContributor : "Anonymous",
//         uploadDate: currentDateWithoutTime!,
//       });
//       // const signedURLResult = await getSignedURL()

//       if (signedURLResult?.failure) {
//         setStatusMessage("Failed" + signedURLResult?.failure);
//         setLoading(false);
//         setErrors({ ...errors, root: signedURLResult?.failure });
//         throw new Error(signedURLResult.failure);
//       }

//       //* success insert signedUrl into db
//       //* url to put to S3 now
//       if (signedURLResult?.success) {
//         const { url, fileId } = signedURLResult?.success;
//         console.log("success in getSignedURL, url: ", url, "fileId: ", fileId);

//         //* upload file using the signed url
//         await fetch(url, {
//           method: "PUT",
//           body: file,
//           headers: {
//             "Content-Type": file.type,
//           },
//         });

//         const trimmedTags = tags
//           .map((tag) => capitalizeWords(tag.trim()))
//           .filter((tag) => tag !== "");

//         if (trimmedTags && trimmedTags.length > 0) {
//           const tagsResult = await createTagPostFile(trimmedTags, fileId);

//           if (tagsResult?.failure) {
//             setStatusMessage("Failed in tag insertion" + tagsResult.failure);
//             setLoading(false);
//             setErrors({ ...errors, root: tagsResult?.failure });
//             throw new Error(tagsResult.failure);
//           }

//           if (tagsResult?.success) {
//             console.log("-- tag result: ", tagsResult?.success);
//           }
//         } else {
//           console.log(" -- no tags");
//         }

//         setStatusMessage("successful uploaded, created");
//       }
//     } catch (error) {
//       console.error("Error during file upload:", error);
//       setErrors({ ...errors, root: error as string });
//       setStatusMessage("failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     //* in browser, get url
//     const file = e.target.files?.[0];
//     setFile(file);

//     //* existing fileUrl, delete
//     if (fileUrl) {
//       URL.revokeObjectURL(fileUrl);
//     }

//     if (file) {
//       const url = URL.createObjectURL(file);
//       console.log("==url: ", url);
//       setFileUrl(url);
//     } else {
//       setFileUrl(undefined);
//     }
//   };


//   console.log("file name: ", file && file.name);

//   console.log("fileUrl: ", fileUrl);


//   const date = new Date();
//   const currentDateWithoutTime = date.toDateString();
//   console.log(currentDateWithoutTime);

//   return (
//     <div className={styles.formAdminWrapper}>
//       {/* <MantineProvider>  */}
//       <p className={styles.formAdminTitle}> Upload file </p>
      
//       <form 
//         className={styles.form}
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         {statusMessage && (
//           <p className={styles.messageStyle}> {statusMessage} </p>
//         )}

//         <div> 
//           <label> Select file </label>
//           <input type="file" accept="pdf" onChange={handleFileChange} />
//           {fileUrl && file && (
//             <div>
//               <iframe src={fileUrl} />

//               <button
//                 type="button"
//                 onClick={() => {
//                   setFile(undefined);
//                   // setFileUrl(undefined);
//                 }}
//               >
//                 Remove
//               </button>
//             </div>
//           )}
        
//         </div>
//         {errors.file && <p className="error">{errors.file}</p>}

//         <div className="flex-col">       
//           <label> Enter file name </label>
//           <Controller 
//             control={control}
//             name="fileName"
//             render={({ field }) => (
//               <input
//                 className={errors.fileName && "input-error"}
//                 {...field}
//                 type="text"
//                 placeholder="Enter file name"
//                 max={100}
//                 name="fileName"
//               />
//             )}
//           />

//           {errors.fileName && <p className="error">{errors.fileName}</p>}
//         </div> 

//         <div className="flex-co gap-p25">
//           <label> Select course</label>
//           <Controller
//             control={control}
//             name="courseId"
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 key={JSON.stringify(coursesOptionsData)} // Add key prop to force re-render
//                 data={coursesOptionsData} // section options for the SelectDropdown
//                 placeholder="Select an option"
//                 disabled={isSubmitting}
//                 onChange={(e) => {
//                   if (e) {
//                     console.log("ee: ",e);
//                     field.onChange(e);
//                     handleCourseChange(e);
//                     // setSelectedCourseLabel(e);
//                   }
//                 }}
//               />
//             )}
//           />
//           {errors.resourceTypeId && <p className="error">{errors.resourceTypeId}</p>}
//         </div>


//         <div className="flex-co gap-p25">
//           <label> Select course topic</label>
//           <Controller
//             control={control}
//             name="courseTopicId"
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 key={JSON.stringify(courseTopicOptions)} // Add key prop to force re-render
//                 data={courseTopicOptions} // module options for the SelectDropdown
//                 placeholder="Select an option"
//                 disabled={isSubmitting}
//                 onChange={(e) => {
//                   if (e) {
//                     console.log(e);
//                     field.onChange(e);
//                     handleCourseTopicChange(e);
//                   }
//                 }}
//               />
//             )}
//           />
//           {errors.courseTopicId && <p className="error">{errors.courseTopicId}</p>}

//         </div>

//         <div className="flex-co gap-p25">
//           <label> Select resource type</label>
//           <Controller
//             control={control}
//             name="resourceTypeId"
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 key={JSON.stringify(resourceTypeOptions)} // Add key prop to force re-render
//                 data={resourceTypeOptions} // section options for the SelectDropdown
//                 placeholder="Select an option"
//                 disabled={isSubmitting}
//                 onChange={(e) => {
//                   if (e) {
//                     console.log(e);
//                     field.onChange(e);
//                     handleResourceTypeChange(e);
//                   }
//                 }}
//               />
//             )}
//           />
//           {errors.resourceTypeId && <p className="error">{errors.resourceTypeId}</p>}
//         </div>

//         <div className="flex-co gap-p25">
//           <label> Select concept </label>
//           <Controller
//             control={control}
//             name="conceptId"
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 key={JSON.stringify(conceptOptions)} // Add key prop to force re-render
//                 data={conceptOptions} // section options for the SelectDropdown
//                 placeholder="Select an option"
//                 disabled={isSubmitting}
//               />
//             )}
//           />
//           {errors.conceptId && <p className="error">{errors.conceptId}</p>}
//         </div>


            
      

//         <div className="flex-col"> 
//           <label> Add Description </label>
//           <Controller
//             control={control}
//             name="description"
//             render={({ field }) => (
//               <input
//                 {...field}
//                 type="text"
//                 name="description"
//                 placeholder="Enter description"
//               />
//             )}
//           />
//         </div>

//         <div className="flex-col">
//           <label> Add contributor </label>
//           <Controller
//             control={control}
//             name="contributors"
//             render={({ field }) => (
//               <input
//                 {...field}
//                 type="text"
//                 name="contributors"
//               />
//             )}
//           />
          
//         </div>

//         <Tags
//           tags={tags}
//           handleAddTag={handleAddTag}
//           handleTagChange={handleTagChange}
//         />

//         <button
//           className={styles.formButton}
//           type="submit"
//           // disable={fileUrl != undefined ? true : false}
//           >
//           Upload
//         </button>
//         {errors.root && <FormError message={errors.root} />}
//       </form>
//     </div>
//   );
// };
