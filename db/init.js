import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5434,
});

async function initDB() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), 'db', 'init-ecommerce-db.sql'), 'utf8');
    await client.query(sql);
    console.log('Database refreshed successfully');
  } catch (err) {
    console.error('Error refreshing DB:', err);
  } finally {
    client.release();
  }
}

export default initDB;