// routes/profileRoutes.js
const express = require('express');
const { getProfilesHandler, searchProfilesHandler } = require('../controllers/profileController');

const router = express.Router();

// GET /api/profiles
router.get('/profiles', getProfilesHandler);

// GET /api/profiles/search
router.get('/profiles/search', searchProfilesHandler);

module.exports = router;