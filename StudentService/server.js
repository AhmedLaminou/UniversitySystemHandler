const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/StudentRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/students', studentRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
    res.send('Student Service is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Student Service running on port ${PORT}`);
});
