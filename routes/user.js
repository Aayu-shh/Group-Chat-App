const userController = require('../controller/user');
const express = require('express');
const router = express.Router();

router.post('/signup',userController.signUp);

module.exports = router;