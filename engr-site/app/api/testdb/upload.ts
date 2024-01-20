// // pages/api/upload.js
// import multer from 'multer';
// import awsS3 from '@/config/awsConfig';
// import { v4 as uuidv4 } from 'uuid';
// import dbConnect from '@/database/dbConnector';

// const s3 = awsS3;

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default upload.single('file')(async function POST(req, res) {
//   try {
//     const { userId, tags } = req.body; // Assuming you pass the user ID and tags array in the request

//     const file = req.file;
//     const fileName = `${uuidv4()}-${file.originalname}`;

//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: fileName,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     const s3Result = await s3.upload(params).promise();
//     const s3Url = s3Result.Location;

//     // Store the file information in the MySQL database
//     const insertFileQuery = `
//       INSERT INTO Files (FileName, S3Url, UploadedUserId)
//       VALUES (?, ?, ?);
//     `;

//     const values = [file.originalname, s3Url, userId];

//     const { results, error: fileError } = await dbConnect(insertFileQuery, values);

//     if (fileError) {
//       return res.status(500).json({ error: 'Error storing file information in the database.' });
//     }

//     const fileId = results.insertId;

//     // Handle tags
//     if (tags && tags.length > 0) {
//       const insertTagQuery = `
//         INSERT INTO Tags (TagName)
//         VALUES (?)
//         ON DUPLICATE KEY UPDATE TagId=LAST_INSERT_ID(TagId);
//       `;

//       const insertFileTagQuery = `
//         INSERT INTO FileTags (FileId, TagId)
//         VALUES (?, ?);
//       `;

//       for (const tag of tags) {
//         // Insert or retrieve existing tag
//         const tagValues = [tag];
//         const { results: tagResults, error: tagError } = await dbConnect( insertTagQuery, tagValues );

//         if (tagError) {
//           console.error('Error storing tag information in the database.');
//           continue;
//         }

//         const tagId = tagResults.insertId || tagResults[0].TagId;

//         // Associate file with tag
//         const fileTagValues = [fileId, tagId];
//         const { error: fileTagError } = await dbConnect( insertFileTagQuery, fileTagValues );

//         if (fileTagError) {
//           console.error('Error associating file with tag in the database.');
//         }
//       }
//     }

//     return res.status(200).json({ message: 'File uploaded successfully.' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal server error.' });
//   }
// });
