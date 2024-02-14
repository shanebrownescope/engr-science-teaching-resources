"use client"
import { useState, ChangeEvent } from 'react'

import { getSignedURL } from '@/actions/uploadingFilesTags/getSignedUrl'
import { createTagPost } from '@/actions/uploadingFilesTags/uploadTagsAction'

import Select from 'react-select';

import styles from '@/styles/test.module.css'
import TestDb from './TestDb'
import Tags from './Tags'


//* Testing: file upload to s3 and db
//* TestDb component: test db is working

type Option = {
  value: string;
  label: string;
}


const TestPath = () => {
  //* state for form 
  const [tags, setTags] = useState([''])

  const [file, setFile] = useState<File | undefined>(undefined)
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [error, setError] = useState(null)


  const courseOptions: Option[] = [
    { value: 'dynamics', label: 'Dynamics' },
    { value: 'strength-of-materials', label: 'Strength of materials' },
  ];

  const [selectedCourseOption, setSelectedCourseOption] = useState<Option | null>(null);

  const handleCourseChange = (selected: Option | null) => {
    setSelectedCourseOption(selected);
  };

  const moduleOptions: Option[] = [
    { value: '1d-motion', label: '1D motion' },
    { value: 'kinematics', label: 'Kinematics' },
  ];

  const [selectedModuleOptions, setSelectedModuleOptions] = useState<Option | null>(null);

  const handleModuleChange = (selected: Option | null) => {
    setSelectedModuleOptions(selected);
  };

  const sectionOptions: Option[] = [
    { value: 'course-notes', label: 'Course notes' },
    { value: 'problems', label: 'Problems' },
    { value: 'quizzes-and-exams', label: 'Quizzes and exams' },
  ];

  const [selectedSectionOptions, setSelectedSectionOptions] = useState<Option | null>(null);

  const handleSectionChange = (selected: Option | null) => {
    setSelectedSectionOptions(selected);
  };


  const handleAddTag = () => {
    if (tags.length < 5) {
      setTags([...tags, '']); // Add an empty tag to the array
    }
  };

  const handleTagChange = (index: number, value: string) => {
    console.log("== value: ", value)
    setTags((prevValues) => {
      // Create a copy of the array
      const tagsCopy = [...prevValues];
      // Update the value at the specified index
      tagsCopy[index] = value;
      return tagsCopy;
    });

  };
  console.log("== tags: ", tags)

  //* WebCrypto API
  //* hash file and turn into string
  const computeSHA256 = async(file: File) => {
    //* convert file content to array buffer 
    //* since crypto.subtle.digest operates on arrayBuffer data
    //* calculates SHA-256 hash of buffer
    //* converts ArrayBuffer to array of bytes (hashArray)
    //* converts each byte to hexadeciaml string
    //* pads it with leading zeros to ensure string is two char long
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    console.log({tags, file})
    try {
      if (!file) {
        setStatusMessage("no file selected")
        setLoading(false)
        console.error("error")
        return
      }
      

      setStatusMessage("uploading file");
      const checksum = await computeSHA256(file)
      const signedURLResult = await getSignedURL({
        fileName: file!.name, 
        fileType: file!.type, 
        fileSize: file!.size, 
        checksum: checksum, 
        course: selectedCourseOption!.value,
        module: selectedModuleOptions!.value,
        section: selectedSectionOptions!.value
      })
      // const signedURLResult = await getSignedURL()

      if (signedURLResult?.failure) {
        setStatusMessage("Failed" + signedURLResult?.failure)
        setLoading(false)
        throw new Error(signedURLResult.failure)
      }

      //* success insert signedUrl into db
      //* url to put to S3 now
      if (signedURLResult?.success) {
        const { url, fileId }  = signedURLResult?.success
        console.log("success in getSignedURL, url: ", url, "fileId: ", fileId)

        //* upload file using the signed url
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type
          }
        })

        const nonEmptyTags = tags.filter(tag => tag != "")

        if (nonEmptyTags && nonEmptyTags.length > 0) {
          const tagsResult = await createTagPost(nonEmptyTags, fileId)

          if (tagsResult?.failure) {
            setStatusMessage("Failed in tag insertion" + tagsResult.failure)
            setLoading(false)
            throw new Error(tagsResult.failure)
          }
          
          if (tagsResult?.success) {
            console.log("-- tag result: ", tagsResult?.success)
          }

        } else {
          console.log(" -- no tags")
        }

        setStatusMessage("successful uploaded, created")
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setStatusMessage("failed");  
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //* in brower, get url
    const file = e.target.files?.[0]
    setFile(file)

    //* exisitng fileUrl, delete 
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }


    if (file) {
      const url = URL.createObjectURL(file)
      console.log("==url: ", url)
      setFileUrl(url)
    } else {
      setFileUrl(undefined)
    }
  }

  console.log("file name: ", file && file.name)


  return (
    <div className={styles.containerr}>
      <form className={styles.wrapper} onSubmit={handleSubmit}>
      {statusMessage && <p className={styles.messageStyle}> {statusMessage} </p>}
        <p> Select file </p>
        <input 
          type="file"
          accept="pdf"
          onChange={handleChange}
        />
        {fileUrl && file && (
          <div>
            <iframe
              src={fileUrl}
            /> 
          
            <button
              type="button"
              onClick={() => {
                setFile(undefined)
                setFileUrl(undefined)
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

        <div>
          <label>Select Course:</label>
          <Select options={courseOptions} value={selectedCourseOption} onChange={handleCourseChange} />
        </div>

        <div>
          <label>Select Module:</label>
          <Select options={moduleOptions} value={selectedModuleOptions} onChange={handleModuleChange} />
        </div>

        <div>
          <label>Select Section:</label>
          <Select options={sectionOptions} value={selectedSectionOptions} onChange={handleSectionChange} />
        </div>


      </form>

      <TestDb />
      <Tags 
        tags={tags} 
        handleAddTag={handleAddTag} 
        handleTagChange={handleTagChange}
      />
      

      
      {/* {error && <div> {error} </div>} */}
      {/* {testDbResult && <div> {testDbResult} </div>} */}
    </div>
  )
}

export default TestPath