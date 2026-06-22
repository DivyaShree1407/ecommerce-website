// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Debug check (remove after fixing)
console.log('register:', register);
console.log('login:', login);

router.post('/register', register);
router.post('/login', login);

module.exports = router;