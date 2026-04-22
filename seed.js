// seed.js
const sql = require('./db.js');
const fs = require('fs');
const { uuidv7 } = require('uuidv7');

async function seedDatabase() {
  try {
    console.log('Reading people.json...');
    
    // Read the JSON file
    const data = fs.readFileSync('./seed_profiles.json', 'utf8');
    const jsonFile = JSON.parse(data);

    const profiles = jsonFile.profiles;
    
    console.log(`Found ${profiles.length} profiles to insert...`);
    
    let inserted = 0;
    let skipped = 0;
    
    // Insert each profile
    for (const profile of profiles) {
      try {
        await sql`
          INSERT INTO profiles (
            id, name, gender, gender_probability, 
            age, age_group, country_id, country_name, 
            country_probability, created_at
          ) VALUES (
            ${uuidv7()}, 
            ${profile.name}, 
            ${profile.gender}, 
            ${profile.gender_probability},
            ${profile.age}, 
            ${profile.age_group}, 
            ${profile.country_id}, 
            ${profile.country_name},
            ${profile.country_probability},
            NOW()
          )
          ON CONFLICT (name) DO NOTHING
        `;
        inserted++;
        
        // Show progress every 500 records
        if (inserted % 500 === 0) {
          console.log(`Processed ${inserted} profiles...`);
        }
      } catch (err) {
        skipped++;
      }
    }
    
    console.log(`Seeding complete!`);
    console.log(`Inserted: ${inserted - skipped} new profiles`);
    console.log(`Skipped: ${skipped} duplicates`);
    
    sql.end();
  } catch (err) {
    console.log('Error:', err.message);
    sql.end();
  }
}

seedDatabase();