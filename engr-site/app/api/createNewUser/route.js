import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConnector";

// Function to insert a new user
async function POST({ name, email, password, role }) {
  const query = 'INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)';
  const values = [name, email, password, role];
  try {

    const results = await dbConnect({ query, values });
    console.log("--results", results)

    if (results.length > 0) {
      const testName = results[0][0].Name;
      return NextResponse.json({message: `created user`}, {status: 201})
    } else {
      return NextResponse.json({message: 'did not create'}, {status: 401})
    }
  } catch (error) {
    console.error({message: 'Error getting test user name:', error});
    return NextResponse({message: "server error"}, {status: 500})
  }
}



  // return dbConnect({ query, values });


export { dbConnect, insertUser };