const userController = require('../controller/user');
const express = require('express');
const userAuth = require('../middlewares/auth');
const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/chat', userAuth.authenticate, userController.chat);
router.get('/loadmessages', userAuth.authenticate, userController.getMessages)
router.get('/newMessage', userAuth.authenticate, userController.getNew);
module.exports = router;