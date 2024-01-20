import dbConnect from "@/database/dbConnector";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = `
      SELECT Name
      FROM Users
    `;

    // return NextResponse.json({message: `success`}, {status: 200})


    console.log("here")
    const results = await dbConnect(query);
    console.log("--results", results)

    if (results[0].length > 0) {
      const testName = results[0][0].Name;
      return NextResponse.json({message: `Test user name: ${testName}`}, {status: 200})
    } else {
      return NextResponse.json({message: 'No name found'}, {status: 401})
    }
  } catch (error) {
    console.error({message: 'Error getting test user name:', error});
    return NextResponse.json({message: "server error"}, {status: 500})
  }
};

