// utils/validators.js

// Validate pagination parameters
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return { valid: false, page: 1, limit: 10, offset: 0 };
  }
  
  if (isNaN(limitNum) || limitNum < 1) {
    return { valid: false, page: pageNum, limit: 10, offset: (pageNum - 1) * 10 };
  }
  
  // Cap limit at 50
  const cappedLimit = Math.min(limitNum, 50);
  
  return { 
    valid: true, 
    page: pageNum, 
    limit: cappedLimit,
    offset: (pageNum - 1) * cappedLimit 
  };
};

// Validate sort parameters
const validateSort = (sort_by, order) => {
  const allowedSortFields = ['age', 'created_at', 'gender_probability'];
  const allowedOrders = ['asc', 'desc'];
  
  const validSortBy = sort_by && allowedSortFields.includes(sort_by) 
    ? sort_by 
    : 'created_at';
    
  const validOrder = order && allowedOrders.includes(order.toLowerCase()) 
    ? order.toLowerCase() 
    : 'desc';
    
  return { sort_by: validSortBy, order: validOrder };
};

module.exports = {
  validatePagination,
  validateSort
};