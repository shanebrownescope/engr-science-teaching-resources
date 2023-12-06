// pages/api/searchFiles.js
import dbConnect from '@/database/dbConnector';

export default async function GET(req, res) {
  try {
    const { query } = req.query; // User's search query
    const tags = req.query.tags ? req.query.tags.split(',') : []; // Convert tags string to an array

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

    const { results, error } = await dbConnect({ query: selectFilesQuery, values });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error retrieving files from the database.' });
    }

    return res.status(200).json({ files: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
