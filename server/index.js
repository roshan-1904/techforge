require('dotenv').config();
try {
    const dns = require('dns');
    // Bypass local DNS resolution issues by using Google's public DNS
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
    console.warn('Warning: Could not set custom DNS servers:', dnsErr.message);
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to DB
connectDB();

const app = express();

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const allowedOrigins = [
    'http://localhost:5173',
    'https://techfrogeworkshop.netlify.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/certificates', express.static(path.join(__dirname, 'public/certificates')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));