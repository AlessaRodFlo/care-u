const express = require('express');
const router = express.Router();
const {
  register,
  confirmEmail,
  login,
  sendResetEmail,
  resetPassword
} = require('../controllers/authController');

// Registro y confirmación
router.post('/register', register);
router.get('/confirm/:token', confirmEmail);

// Login
router.post('/login', login);

// Recuperación de contraseña
router.post('/recover', sendResetEmail);
router.post('/reset/:token', resetPassword);

module.exports = router;
