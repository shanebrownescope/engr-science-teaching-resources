import mysql, { RowDataPacket, FieldPacket } from 'mysql2/promise';

const db = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_NAME
})

async function dbConnect(query: string, values?: any[]): Promise<any> {
  try {
    const results = await db.query(query, values)
    // console.log("== query", query, "value", values, "db result", results)
    return { results }
  } catch (error) {
    console.error("Error in dbConnect:", error);
    return { error }
  }
}

export default dbConnect;
