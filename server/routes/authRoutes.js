const express = require('express');
const { register, login , getAllUsersWithRoleUser } = require('../controllers/authController.js');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsersWithRoleUser);
module.exports = router;
