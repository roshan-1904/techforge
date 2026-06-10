const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { name, college, department, year, email, mobile, workshop, startDate, endDate } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = await User.create({
            name, college, department, year, email, mobile, workshop, startDate, endDate
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
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