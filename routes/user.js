const userController = require('../controller/user');
const express = require('express');
const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
module.exports = router;