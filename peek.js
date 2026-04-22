// peek.js
const fs = require('fs');

const data = fs.readFileSync('./seed_profiles.json', 'utf8');
const json = JSON.parse(data);

console.log('Type:', typeof json);
console.log('Keys:', Object.keys(json));
console.log('First few items:', JSON.stringify(json).substring(0, 500));