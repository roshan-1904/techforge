const express = require('express');
const router = express.Router();
const { loginAdmin, getRegistrations, approveRegistration, rejectRegistration, getStats, generatePreviewPDF } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/registrations', protect, getRegistrations);
router.get('/stats', protect, getStats);
router.put('/approve/:id', protect, approveRegistration);
router.put('/reject/:id', protect, rejectRegistration);
router.post('/preview-pdf', protect, generatePreviewPDF);

module.exports = router;