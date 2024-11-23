const userController = require('../controller/user');
const express = require('express');
const userAuth = require('../middlewares/auth');
const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/chat', userAuth.authenticate, userController.chat);
module.exports = router;