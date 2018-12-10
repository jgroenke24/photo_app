import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
const pool = new Pool({
  connectionString: process.end.DATABASE_URL
});

export default {
  
  // Export database query.  Should return a promise to use with async/await
  query(text, params) {
    pool.query(text, params);
  }
};