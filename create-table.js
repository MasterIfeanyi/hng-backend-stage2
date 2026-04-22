// create-table.js
const sql = require('./db.js');

async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
        gender_probability FLOAT,
        age INTEGER,
        age_group VARCHAR(20) CHECK (age_group IN ('child', 'teenager', 'adult', 'senior')),
        country_id VARCHAR(2),
        country_name VARCHAR(100),
        country_probability FLOAT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('Table "profiles" created successfully!');
    
    // Create indexes for faster searching (IMPORTANT for performance points!)
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_age_group ON profiles(age_group)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_country_id ON profiles(country_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age)`;
    
    console.log('Indexes created successfully!');
    
    sql.end();
  } catch (err) {
    console.log('Error:', err.message);
    sql.end();
  }
}

createTable();