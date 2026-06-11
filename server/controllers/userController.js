const User = require('../models/User');
const mongoose = require('mongoose');

const registerUser = async (req, res) => {
    try {
        // Log the incoming request
        console.log('[REGISTER] New request body:', JSON.stringify(req.body, null, 2));

        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            console.error('[REGISTER] DB Connection State:', mongoose.connection.readyState);
            return res.status(503).json({ 
                message: 'Database is not connected. Please check your internet or whitelist your IP in MongoDB Atlas.' 
            });
        }

        const { name, college, department, year, email, mobile, workshop, startDate, endDate } = req.body;
        
        // Basic validation before DB call
        if (!name || !email || !mobile) {
            return res.status(400).json({ message: 'Missing required fields: name, email, and mobile are mandatory.' });
        }

        console.log('[REGISTER] Checking if user exists in DB for email:', email);
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('[REGISTER] User already exists:', email);
            return res.status(400).json({ message: 'Email already registered' });
        }

        console.log('[REGISTER] Creating new user record...');
        const user = await User.create({
            name, college, department, year, email, mobile, workshop, startDate, endDate
        });

        console.log('[REGISTER] Registration successful for:', email);
        res.status(201).json(user);
    } catch (error) {
        console.error('[REGISTER] ERROR:', error);
        
        // Check for specific Mongoose errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate key error: This email might already be in use.' });
        }

        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

const getStatus = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ certificateId: id });
        if (!user) {
            return res.status(404).json({ message: 'Invalid Certificate' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser, getStatus, verifyCertificate };