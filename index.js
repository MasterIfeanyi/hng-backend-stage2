// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET']
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        status: 'alive',
        message: 'Backend Wizard API - Stage 2',
        endpoints: {
            profiles: '/api/profiles',
            search: '/api/profiles/search'
        }
    });
});

app.use('/api', profileRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});