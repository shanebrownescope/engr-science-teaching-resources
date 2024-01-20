// pages/api/searchFiles.js
import dbConnect from '@/database/dbConnector';
import { NextRequest, NextResponse } from 'next/server';

export default async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { query } = await req.json(); // User's search query
    const tags = query.tags ? query.tags.split(',') : []; // Convert tags string to an array

    // Construct the SQL query
    const selectFilesQuery = `
      SELECT Files.*
      FROM Files
      JOIN FileTags ON Files.FileId = FileTags.FileId
      JOIN Tags ON FileTags.TagId = Tags.TagId
      WHERE (Files.FileName LIKE ? OR Tags.TagName IN (?))
      GROUP BY Files.FileId;
    `;

    // Values to be inserted into the query
    const values = [`%${query}%`, tags];

    const { results, error } = await dbConnect(selectFilesQuery, values );

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error retrieving files from the database.' }, {status: 500});
    }

    return NextResponse.json({ files: results }, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500});
  }
}
