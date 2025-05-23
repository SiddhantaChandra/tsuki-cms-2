const fs = require('fs');
const path = require('path');

// Path to the exported database dump
const dumpPath = path.join(__dirname, '..', 'supabase', 'seed_exported.sql');
// Path to the seed file where we'll write our cleaned data
const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');

// Read the dump file
const dumpContent = fs.readFileSync(dumpPath, 'utf8');

// Function to extract INSERT statements for a specific table
function extractTableData(content, tableName) {
  const regex = new RegExp(`-- Data for Name: ${tableName};.*?INSERT INTO.*?\\);`, 'gs');
  const match = content.match(regex);
  
  if (!match) return null;
  
  // Extract just the INSERT statements
  const insertRegex = /INSERT INTO.*?\);/gs;
  const inserts = [];
  let insertMatch;
  
  while ((insertMatch = insertRegex.exec(match[0])) !== null) {
    inserts.push(insertMatch[0]);
  }
  
  return inserts.join('\n');
}

// Tables we want to extract for the seed file
const tables = [
  'admin_list',
  'user_roles',
  'categories',
  'grade_companies',
  'sets',
  'subsets',
  'cards',
  'slabs',
  'accessories'
];

// Create the seed file content
let seedContent = `-- Initial seed data for Tsuki CMS
-- Generated from database export on ${new Date().toISOString().split('T')[0]}

`;

// Extract data for each table
for (const table of tables) {
  const tableData = extractTableData(dumpContent, table);
  if (tableData) {
    seedContent += `-- ${table} data\n${tableData}\n\n`;
  } else {
    seedContent += `-- No data found for ${table}\n\n`;
  }
}

// Write to the seed file
fs.writeFileSync(seedPath, seedContent);

console.log(`Seed file created at ${seedPath}`); 