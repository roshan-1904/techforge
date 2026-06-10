const Admin = require('../models/Admin');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const jwt = require('jsonwebtoken');
const { generateCertificate } = require('../utils/pdfGenerator');
const sendEmail = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '30d' });
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                email: admin.email,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRegistrations = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const total = await User.countDocuments();
        const approved = await User.countDocuments({ status: 'Approved' });
        const pending = await User.countDocuments({ status: 'Pending' });
        const rejected = await User.countDocuments({ status: 'Rejected' });
        
        res.json({ total, approved, pending, rejected });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNextSequenceValue = async () => {
   const count = await Certificate.countDocuments();
   return `TFI-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
};

const approveRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { theme } = req.body;
        console.log(`[APPROVE] Starting approval for user ID: ${id} with theme: ${theme}`);
        
        const user = await User.findById(id);
        if (!user) {
            console.log(`[APPROVE] User not found: ${id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.status === 'Approved') {
            return res.status(400).json({ message: 'User already approved' });
        }

        console.log(`[APPROVE] Generating sequence value...`);
        const certId = await getNextSequenceValue();
        
        console.log(`[APPROVE] Calling generateCertificate for ${certId}...`);
        // Pass the theme to the generator
        const userDataWithTheme = { ...user.toObject(), theme };
        const pdfUrl = await generateCertificate(userDataWithTheme, certId);
        console.log(`[APPROVE] PDF Generated successfully: ${pdfUrl}`);
        
        console.log(`[APPROVE] Creating Certificate record...`);
        const certificate = await Certificate.create({
            certificateId: certId,
            userId: user._id,
            pdfUrl,
            qrCode: 'qr-generated'
        });

        console.log(`[APPROVE] Updating User status...`);
        user.status = 'Approved';
        user.certificateId = certId;
        user.certificateUrl = pdfUrl;
        await user.save();

        // Send Email
        console.log(`[APPROVE] Attempting to send email...`);
        try {
            const fs = require('fs');
            const path = require('path');
            const attachmentPath = path.join(__dirname, '../public', pdfUrl);
            
            await sendEmail({
                email: user.email,
                subject: 'TechForge Workshop Certificate',
                message: `Congratulations ${user.name},\n\nYour participation certificate has been approved and attached.\n\nRegards,\nTechForge Team`,
                attachments: [
                    {
                        filename: `${certId}.pdf`,
                        path: attachmentPath
                    }
                ]
            });
            console.log(`[APPROVE] Email sent successfully to ${user.email}`);
        } catch(emailErr) {
            console.error('[APPROVE] Email sending failed:', emailErr.message);
            // Don't fail the whole request if only email fails
        }

        console.log(`[APPROVE] Approval process completed for ${user.name}`);
        res.json({ message: 'Approved and Certificate Generated', user });
    } catch (error) {
        console.error('[APPROVE] CRITICAL ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

const rejectRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.status = 'Rejected';
        await user.save();
        
        res.json({ message: 'Registration Rejected', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generatePreviewPDF = async (req, res) => {
    try {
        const userData = req.body;
        const certId = userData.certificateId || 'PREVIEW';
        console.log(`[PREVIEW] Generating preview for ${userData.name}...`);
        
        const pdfUrl = await generateCertificate(userData, certId);
        res.json({ pdfUrl });
    } catch (error) {
        console.error('[PREVIEW] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginAdmin, getRegistrations, approveRegistration, rejectRegistration, getStats, generatePreviewPDF };