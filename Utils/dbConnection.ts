import { createPool } from "promise-mysql";
import dotenv from "dotenv";

dotenv.config();

const pool = createPool({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 10,
});

export default pool;
