// controllers/profileController.js
const { getProfiles } = require('../models/profileModel');
const { validatePagination, validateSort } = require('../utils/validators');
const { parseQuery } = require('../utils/queryParser');

// GET /api/profiles
const getProfilesHandler = async (req, res) => {
  try {
    // Extract query parameters
    const {
      gender,
      age_group,
      country_id,
      min_age,
      max_age,
      min_gender_probability,
      min_country_probability,
      sort_by,
      order,
      page = 1,
      limit = 10
    } = req.query;

    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (!pagination.valid) {
      return res.status(422).json({
        status: 'error',
        message: 'Invalid query parameters'
      });
    }
    
    // Validate sorting
    const sort = validateSort(sort_by, order);
    
    // Build filters object
    const filters = {
      gender,
      age_group,
      country_id,
      min_age,
      max_age,
      min_gender_probability,
      min_country_probability
    };
    
    // Get data from model
    const { profiles, total } = await getProfiles(filters, sort, pagination);
    
    // Return success response
    return res.status(200).json({
      status: 'success',
      page: pagination.page,
      limit: pagination.limit,
      total: total,
      data: profiles
    });
    
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// GET /api/profiles/search (placeholder for now)
const searchProfilesHandler = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    // Check if query exists
    if (!q || q.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Missing or empty parameter'
      });
    }
    
    // Parse the natural language query
    const parseResult = parseQuery(q);
    
    // If parsing failed, return error
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: parseResult.error
      });
    }
    
    // Validate pagination
    const pagination = validatePagination(page, limit);
    if (!pagination.valid) {
      return res.status(422).json({
        status: 'error',
        message: 'Invalid query parameters'
      });
    }
    
    // Use the parsed filters
    const filters = parseResult.filters;
    const sort = { sort_by: 'created_at', order: 'desc' };
    
    // Get data from model
    const { profiles, total } = await getProfiles(filters, sort, pagination);
    
    // Return success response
    return res.status(200).json({
      status: 'success',
      page: pagination.page,
      limit: pagination.limit,
      total: total,
      data: profiles
    });
    
  } catch (error) {
    console.error('Search Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = {
  getProfilesHandler,
  searchProfilesHandler
};