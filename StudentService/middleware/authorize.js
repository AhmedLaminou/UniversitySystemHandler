const axios = require('axios');
require('dotenv').config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

const authorize = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];

        // Call the Spring Boot Auth Service to validate the token and get user info
        const response = await axios.get(AUTH_SERVICE_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // If successful, attach user info to the request
        req.user = response.data;
        next();

    } catch (error) {
        console.error('Authorization error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json({ message: 'Unauthorized', error: error.response.data });
        }
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if the user has the ADMIN role
    // The Java Role enum is: ADMIN, PROFESSOR, STUDENT
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    next();
};

module.exports = { authorize, authorizeAdmin };
