const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middlewares/auth');

router.get('/register', isGuest, authController.showRegisterForm);
router.post('/register', isGuest, authController.register);
router.get('/login', isGuest, authController.showLoginForm);
router.post('/login', isGuest, authController.login);
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;