import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

export default {
  
  // Export database query.  Should return a promise to use with async/await
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
};