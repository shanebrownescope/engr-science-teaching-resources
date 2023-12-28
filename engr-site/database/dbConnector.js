import mysql from 'mysql2/promise';


const db = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_NAME
})

async function dbConnect({query, values}) {
  try {
    const results = await db.query(query, values)
    return results
  } catch (error) {
    console.log("--nope")
    return { error };
  }
}

export default dbConnect;
