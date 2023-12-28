import dbConnect from "@/database/dbConnector";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const query = `
      SELECT Name
      FROM Users
    `;

    const results = await dbConnect({ query });
    console.log("--results", results)

    if (results[0].length > 0) {
      const testName = results[0][0].Name;
      return NextResponse.json({message: `Test user name: ${testName}`}, {status: 200})
    } else {
      return NextResponse.json({message: 'No name found'}, {status: 401})
    }
  } catch (error) {
    console.error({message: 'Error getting test user name:', error});
    return NextResponse({message: "server error"}, {status: 500})
  }
};

