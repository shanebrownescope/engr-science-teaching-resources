"use client"
import { useState } from "react"

// import { testingAction } from '@/actions/uploadingFilesTags/getSignedUrl'

// import { testingAction } from "@/config/action";
import { Button } from "@mantine/core";

//* Test getting first user in db
//* Test insert user into db
const TestDb = () => {
  //* test db
  const [testDbResult, setTestDbResult] = useState<any>();
  const [loading1, setLoading1] = useState(false);
  const [error, setError] = useState(undefined);

  const testDB = async () => {
    try {
      setLoading1(true);
      const response = await fetch("/api/testdb");
      const data = await response.json();
      setTestDbResult(data.message);
    } catch (error) {
      setTestDbResult(error);
      // setError(error.statusMessage)
    } finally {
      setLoading1(false);
    }
  };

  //* test inerst
  // Example usage
  const newUser = {
    name: "admin2",
    email: "admin2@email.com",
    password: "12345678",
    role: "admin",
  };

  const [loading2, setLoading2] = useState(false);
  const [insertResult, setInsertResult] = useState();

  const insertUser = async () => {
    try {
      setLoading2(true);
      const response = await fetch("/api/createNewUser", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setInsertResult(data.message);
    } catch (error) {
      console.error("Error inserting user");
    } finally {
      setLoading2(false);
    }
  };

  const testAction = async () => {
    // try {
    //   const response = await testingAction();
    //   console.log(response);
    // } catch (error) {
    //   throw Error("-- testAction failed");
    // }
  };

  return (
    <div>
      {/* <Button onClick={testDB} variant="filled" style={{ margin: "10px" }}>
        Test database
      </Button>

      <Button onClick={insertUser} variant="filled" style={{ margin: "10px" }}>
        Test insert user
      </Button> */}

      {loading1 && <p> chekcing database </p>}
      {testDbResult && <p> {testDbResult} </p>}

      {loading2 && <p> inserting user </p>}
      {insertResult && <p> user created id: {insertResult} </p>}

      {/* <Button onClick={testAction} variant="filled" style={{ margin: "10px" }}>
        Test action
      </Button> */}
    </div>
  );
};

export default TestDb;
