import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

// ✅ Create PostgreSQL pool
const pool = new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT) || 5432,

  // Render / production มักต้องใช้ SSL
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  max: 10,                 // connectionLimit
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL database connected successfully");
    client.release();
  } catch (err) {
    console.error("PostgreSQL connection failed:", err.message);
    process.exit(1);
  }
})();

// Error handling
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
  process.exit(1);
});

// Query helper (แทน pool.execute)
export const executeQuery = async (query, params = []) => {
  const { rows } = await pool.query(query, params);
  return rows;
};

// Enhanced query helper with transaction support
export const executeQueryWithTransaction = async (queries) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const results = [];
    for (const { query, params } of queries) {
      const { rows } = await client.query(query, params);
      results.push(rows);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Single query helper (สำหรับการ query เดี่ยว)
export const executeSingleQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, params);
    return rows;
  } finally {
    client.release();
  }
};

export default pool;
