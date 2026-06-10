const express = require('express');
const router = express.Router();
const { registerUser, getStatus, verifyCertificate } = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/status/:email', getStatus);
router.get('/verify/:id', verifyCertificate);

module.exports = router;