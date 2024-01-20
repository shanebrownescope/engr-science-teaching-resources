import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/dbConnector";

// Function to insert a new user
export async function POST(req: NextRequest) {
  const query = 'INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)';

  //* this is how to get data of body - await req.json()
  const { name, email, password, role } = await req.json()

  const values = [name, email, password, role];

  if (!name || !email || !password || !role) {
    return NextResponse.json({message: 'values invalid'}, {status: 401})
  }
  try {

    const results = await dbConnect(query, values);

    if (results.length > 0) {
      console.log("==results[0]", results[0].insertId)
      // const testName = results[0][0].Name;
      return NextResponse.json({message: results[0].insertId}, {status: 201})
    } else {
      return NextResponse.json({message: 'did not create'}, {status: 401})
    }
  } catch (error) {
    console.error({message: 'Error getting test user name:', error});
    return NextResponse.json({message: "server error"}, {status: 500})
  }
}






