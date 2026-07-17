const express = require('express');
const { register, login, recoverPassword } = require('../controllers/authController.js');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/recover', recoverPassword);

module.exports =router;