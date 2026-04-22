// models/profileModel.js
const sql = require('../db.js');

// Build WHERE clause dynamically
const buildWhereClause = (filters) => {
  const conditions = [];
  const params = [];
  
  if (filters.gender) {
    conditions.push(`gender = $${params.length + 1}`);
    params.push(filters.gender.toLowerCase());
  }
  
  if (filters.age_group) {
    conditions.push(`age_group = $${params.length + 1}`);
    params.push(filters.age_group.toLowerCase());
  }
  
  if (filters.country_id) {
    conditions.push(`country_id = $${params.length + 1}`);
    params.push(filters.country_id.toUpperCase());
  }
  
  if (filters.min_age) {
    conditions.push(`age >= $${params.length + 1}`);
    params.push(parseInt(filters.min_age));
  }
  
  if (filters.max_age) {
    conditions.push(`age <= $${params.length + 1}`);
    params.push(parseInt(filters.max_age));
  }
  
  if (filters.min_gender_probability) {
    conditions.push(`gender_probability >= $${params.length + 1}`);
    params.push(parseFloat(filters.min_gender_probability));
  }
  
  if (filters.min_country_probability) {
    conditions.push(`country_probability >= $${params.length + 1}`);
    params.push(parseFloat(filters.min_country_probability));
  }
  
  const whereClause = conditions.length > 0 
    ? `WHERE ${conditions.join(' AND ')}` 
    : '';
    
  return { whereClause, params };
};

// Build ORDER BY clause
const buildOrderByClause = (sort) => {
  const allowedSortFields = ['age', 'created_at', 'gender_probability'];
  
  if (sort.sort_by && allowedSortFields.includes(sort.sort_by)) {
    const sortOrder = sort.order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    return `ORDER BY ${sort.sort_by} ${sortOrder}`;
  }
  
  return 'ORDER BY created_at DESC';
};

// Get profiles with filters, sorting, and pagination
const getProfiles = async (filters, sort, pagination) => {
  const { whereClause, params } = buildWhereClause(filters);
  const orderByClause = buildOrderByClause(sort);
  const { limit, offset } = pagination;
  
  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM profiles ${whereClause}`;
  const countResult = await sql.unsafe(countQuery, params);
  const total = parseInt(countResult[0].total);
  
  // Get paginated data
  const dataQuery = `
    SELECT id, name, gender, gender_probability, age, age_group, 
           country_id, country_name, country_probability, created_at 
    FROM profiles 
    ${whereClause}
    ${orderByClause}
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  const profiles = await sql.unsafe(dataQuery, params);
  
  return { profiles, total };
};

// Search profiles (for natural language endpoint)
const searchProfiles = async (filters, pagination) => {
  return getProfiles(
    filters, 
    { sort_by: 'created_at', order: 'desc' }, 
    pagination
  );
};

module.exports = {
  getProfiles,
  searchProfiles
};