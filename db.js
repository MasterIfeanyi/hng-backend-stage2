// db.js
const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL, {
  ssl: false // REQUIRED for Supabase free tier
});

module.exports = sql;