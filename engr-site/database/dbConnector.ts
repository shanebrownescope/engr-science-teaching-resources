import mysql, { RowDataPacket, FieldPacket } from "mysql2/promise";

// Create a MySQL connection pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


/**
 * Connects to the database and executes the given query.
 *
 * @param {string} query - The SQL query to execute.
 * @param {any[]} [values] - Optional array of values to be interpolated into the query.
 * @return {Promise<any>} A promise that resolves to an object containing the query results, or an error object if the query fails.
 */
async function dbConnect(query: string, values?: any[]): Promise<any> {
  try {
    const results = await db.query(query, values);
    // console.log("-----: ", results)
    return { results };
  } catch (error) {
    return { error };
  }
}

export default dbConnect;
