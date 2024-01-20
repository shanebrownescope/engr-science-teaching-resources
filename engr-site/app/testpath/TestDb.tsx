"use client"
import { useState } from "react"

import { testingAction } from '@/config/action'


//* Test getting first user in db
//* Test insert user into db
const TestDb = () => {
  //* test db 
  const [testDbResult, setTestDbResult] = useState<any>()
  const [loading1, setLoading1] = useState(false)
  const [error, setError] = useState(undefined)

  const testDB = async () => {
    try {
      setLoading1(true)
      const response = await fetch('/api/testdb')
      const data = await response.json()
      setTestDbResult(data.message)
    } catch (error) {
      setTestDbResult(error)
      // setError(error.statusMessage)
    } finally {
      setLoading1(false)
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


  const [loading2, setLoading2] = useState(false) 
  const [insertResult, setInsertResult] = useState()

  const insertUser = async() => {
    try {
      setLoading2(true)
      const response = await fetch('/api/createNewUser', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setInsertResult(data.message)

    } catch (error) {
      console.error('Error inserting user');
      
    } finally {
      setLoading2(false)
    }
  }

  const testAction = async() => {
    try {
      const response = await testingAction()
      console.log(response)
    } catch (error) {
      throw Error("-- testAction failed")
    }
  }

  return (
    <div>
      <button onClick={testDB}> 
        Test database
      </button>

      <button onClick={insertUser}>
        test insert user
      </button>   

      {loading1 && <p> chekcing database </p>}
      {testDbResult && <p> {testDbResult} </p>}

      {loading2 && <p> inserting user </p>}
      {insertResult && <p> user created id: {insertResult} </p>}

      <button onClick={testAction}>
        testAction
      </button>

    </div>
  )
}

export default TestDb