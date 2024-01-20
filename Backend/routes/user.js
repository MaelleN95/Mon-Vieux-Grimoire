const express = require('express');
const router = express.Router();

// Import middleware
const validators = require('../middlewares/user-validators');

// Import user controller
const userCtrl = require('../controllers/user');

router.post(
  '/signup',
  validators.checkEmail,
  validators.checkPw,
  userCtrl.signup
);
router.post('/login', userCtrl.login);

module.exports = router;
