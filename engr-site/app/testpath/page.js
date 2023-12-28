"use client"
import { useState } from 'react'
import Image from 'next/image'

import { getSignedURL } from '@/config/action'


const TestPath = () => {
  const [content, setContent] = useState("")
  const [file, setFile] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [error, setError] = useState(null)

  const computeSHA256 = async(file) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    return hashHex
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    console.log({content, file})
    try {
      if (!file) {
        setStatusMessage("no file selected")
        setLoading(false)
        console.error("error")
        return
      }
      

      setStatusMessage("uploading file");
      // const checksum = await computeSHA256(file)
      // const signedURLResult = await getSignedURL(file.type, file.size, checksum)
      const signedURLResult = await getSignedURL()


      if (signedURLResult.failure !== undefined) {
        setStatusMessage("Failed")
        setLoading(false)
        console.error("no file selected")
        return
      }

      const url = signedURLResult.success.url
      console.log({url})

      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type
        }
      })
      setStatusMessage("created")
    } catch (error) {
      console.error("Error during file upload:", error);
      setStatusMessage("failed");  
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    //* in brower, get url
    
    const file = e.target.files?.[0]
    setFile(file)

    //* exisitng fileUrl, delete 
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }


    if (file) {
      const url = URL.createObjectURL(file)
      console.log(url)
      setFileUrl(url)
    } else {
      setFileUrl(undefined)
    }
  }

  //* test db 
  const [testDbResult, setTestDbResult] = useState()
  const testDB = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/testdb')
      const data = await response.json()
      setTestDbResult(data.message)
    } catch (error) {
      setTestDbResult(error)
      setError(error.statusMessage)
    } finally {
      setLoading(false)
    }
  }

  //* test inerst
// Example usage
const newUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'securepassword',
  role: 'user',
};

const insertUser = async() => {
  try {
    setLoading(true)
    const response = await fetch('/api/createNewUser', {
      method: 'POST',
      body: newUser
    })
    const data = await response.json()
    console.log('User inserted successfully!');

  } catch (error) {
    console.error('Error inserting user:', result.error);
  } finally {
    setLoading(false)
  }
}


  const container = {
    display: "flex",
    justifyContent: "center",
    width: "100%"
  }
  const styles = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "20px",
    width: "400px",
    marginTop: "200px",
    border: "1px solid white",
    background: "none",
    padding: "20px"
  }

  const messageStyle = {
    background: "lightYellow",
    padding: "20px",
    color: "black"
  }
  return (
    <div style={container}>
      <form style={styles} onSubmit={handleSubmit}>
      {statusMessage && <p style={messageStyle}> {statusMessage} </p>}
        <p> Select file </p>
        <input 
          type="file"
          accpet="pdf"
          onChange={handleChange}
        />
        {fileUrl && file && (
          <div>
            <iframe
              src={fileUrl}
              alt={file.name}
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
      </form>

      <button
        onClick={testDB}
      > Test database</button>
      <button onClick={insertUser}>
        test insert user
      </button>
      {/* {error && <div> {error} </div>} */}
      {/* {testDbResult && <div> {testDbResult} </div>} */}
    </div>
  )
}

export default TestPath