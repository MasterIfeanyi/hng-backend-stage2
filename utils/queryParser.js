// utils/queryParser.js

// Country name to ISO code mapping
const countryMap = {
  'nigeria': 'NG',
  'ghana': 'GH',
  'kenya': 'KE',
  'tanzania': 'TZ',
  'uganda': 'UG',
  'south africa': 'ZA',
  'egypt': 'EG',
  'morocco': 'MA',
  'angola': 'AO',
  'ethiopia': 'ET',
  'cameroon': 'CM',
  'zimbabwe': 'ZW',
  'zambia': 'ZM',
  'senegal': 'SN',
  'rwanda': 'RW',
  'benin': 'BJ',
  'togo': 'TG',
  'mali': 'ML',
  'niger': 'NE',
  'chad': 'TD',
  'algeria': 'DZ',
  'tunisia': 'TN',
  'libya': 'LY',
  'sudan': 'SD',
  'somalia': 'SO',
  'congo': 'CG',
  'ivory coast': 'CI',
  'mozambique': 'MZ',
  'madagascar': 'MG'
};

// Age group keywords mapping
const ageGroupKeywords = {
  'child': 'child',
  'children': 'child',
  'teenager': 'teenager',
  'teenagers': 'teenager',
  'teen': 'teenager',
  'teens': 'teenager',
  'adult': 'adult',
  'adults': 'adult',
  'senior': 'senior',
  'seniors': 'senior',
  'elderly': 'senior',
  'old': 'senior'
};

// Parse natural language query
const parseQuery = (queryText) => {
  if (!queryText || queryText.trim() === '') {
    return { success: false, error: 'Empty query' };
  }
  
  const text = queryText.toLowerCase();
  const filters = {};
  
  // 1. Check for "young" keyword (special case: ages 16-24)
  if (text.includes('young')) {
    filters.min_age = 16;
    filters.max_age = 24;
  }
  
  // 2. Check for gender
  if (text.includes('male') && !text.includes('female')) {
    filters.gender = 'male';
  } else if (text.includes('female')) {
    filters.gender = 'female';
  }
  
  // 3. Check for age group keywords
  for (const [keyword, ageGroup] of Object.entries(ageGroupKeywords)) {
    if (text.includes(keyword)) {
      filters.age_group = ageGroup;
      break; // Take first match
    }
  }
  
  // 4. Check for "above X" or "over X" age pattern
  const aboveMatch = text.match(/(?:above|over)\s+(\d+)/);
  if (aboveMatch) {
    filters.min_age = parseInt(aboveMatch[1]);
  }
  
  // 5. Check for "below X" or "under X" age pattern
  const belowMatch = text.match(/(?:below|under)\s+(\d+)/);
  if (belowMatch) {
    filters.max_age = parseInt(belowMatch[1]);
  }
  
  // 6. Check for countries in the text
  for (const [countryName, countryCode] of Object.entries(countryMap)) {
    if (text.includes(countryName)) {
      filters.country_id = countryCode;
      break; // Take first country match
    }
  }
  
  // 7. Special case: "from X" pattern for countries
  const fromMatch = text.match(/from\s+([a-z\s]+?)(?:\s|$)/);
  if (fromMatch && !filters.country_id) {
    const country = fromMatch[1].trim().toLowerCase();
    if (countryMap[country]) {
      filters.country_id = countryMap[country];
    }
  }
  
  // If we found ANY filters, return success
  if (Object.keys(filters).length > 0) {
    return { success: true, filters };
  }
  
  // No filters found = unable to interpret
  return { success: false, error: 'Unable to interpret query' };
};

module.exports = { parseQuery };