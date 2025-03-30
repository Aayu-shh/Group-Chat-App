const User = require('../models/user');
const Message = require('../models/message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, Op } = require('sequelize');

exports.signUp = async (req, res) => {
    console.log("!!Request from FRONTend recieved by backend");
    //console.log("\n-----------\nValues:\nName: " + req.body.name + "\nEmail: " + req.body.email + "\nPhone: " + req.body.phone + "\nPassword: " + req.body.password);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name,Email and Password are required feilds" })
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name,
            email: email,
            phone: phone,
            password: hashedPass
        });
        return res.send({ user: newUser, Message: "New User added to DB", Success: true });
    }
    catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: err.errors.map(err => err.message), success: false });
        }
        else if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: err.errors.map(err => err.message), success: false });
        }
        else {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error, Something went wrong!" });
        }
    }
    //res.status(200).json({Success:true,Message:"Request has been recieved by your backend!"});
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    const userInDb = await User.findOne({ where: { email: email } });
    const id = userInDb.id;
    console.log("User found:" + userInDb.name)
    if (userInDb) {
        const isPassCorrect = await bcrypt.compare(pass, userInDb.password);
        //If user in DB > Check Pass
        if (isPassCorrect) {
            res.status(200).send({ success: true, message: "User found!", token: `${generateToken(email, id)}`, userId: id });
        }
        else {
            res.status(401).send({ success: false, message: "Wrong Password!" });
        }
    }
    else {
        //If User not in DB
        res.status(404).send({ success: false, message: "User Not found" });
    }


}

exports.chat = async (req, res) => {
    const incoming = req.body.message;
    console.log("Message from Frontend ->" + incoming);
    try {
        const newMessage = await Message.create({ message: incoming, userId: req.user.id })
        return res.send({ message: newMessage, success: true });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    }
}

exports.getMessages = async (req, res) => {
    try {
        const lastMsgId = parseInt(req.query.lastMsgId) || 0;
        const messages = await Message.findAll({
            where: {
                id: {
                    [Op.gt]: parseInt(lastMsgId)
                }
            }
        });
        messages.forEach(x => console.log(x.message));
        return res.send({ messages, success: true, count: messages.length, error: null });
    }
    catch (err) {
        console.log(err);
        return res.send(500).send({ message: "Something Went Wrong!", success: false, count: 0, error: err, });
    }
}

exports.getNewMessagesByCount = async (req, res) => {
    try {
        const messageCount = await Message.count();
        const numOfMessagesOnScreen = req.query.numOfMessages;
        if (messageCount > parseInt(numOfMessagesOnScreen)) {
            const newMessages = await Message.findAll({
                //checking by ID is not optimal, id messages are deleted from DB IDs will mislead 
                where: {
                    id: {
                        [Op.gt]: parseInt(numOfMessagesOnScreen)
                    }
                }
            });
            return res.send({ newMessages: newMessages, success: true, count: newMessages.length, error: null });
        }
        else if (messageCount === parseInt(numOfMessagesOnScreen)) {
            return res.send({ newMessages: null, success: true, count: 0, error: null });
        }
        else {
            return res.send({ newMessages: null, success: false, count: 0, error: "Something went wrong" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Something Went Wrong!", error: err, });
    }
}

exports.getNewMessagesById = async (req, res) => {
    try {
        const lastMsgIdOnScreen = parseInt(req.query.lastMsgId, 0);

        // Validate the parsed ID to ensure it is a non-negative number
        if (isNaN(lastMsgIdOnScreen) || lastMsgIdOnScreen < 0) {
            return res.status(400).send({ success: false, error: "Invalid or missing lastMsgId provided" });
        }

        // Fetch the maximum message ID currently in the database
        const lastMessage = await Message.findOne({
            attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'maxId']]
        });
        const lastIdInDB = lastMessage ? lastMessage.get('maxId') : 0;

        // Compare the last message ID on the screen with the maximum ID in the database
        if (lastIdInDB > parseInt(lastMsgIdOnScreen)) {
            const newMessages = await Message.findAll({
                where: {
                    id: {
                        [Op.gt]: parseInt(lastMsgIdOnScreen) // Fetch messages with IDs greater than lastMsgIdOnScreen
                    }
                }
            });
            return res.send({ newMessages: newMessages, success: true, count: newMessages.length, error: null });
        }
        else if (lastIdInDB === parseInt(lastMsgIdOnScreen)) {
            return res.send({ newMessages: null, success: true, count: 0, error: null });
        }
        else {
            return res.send({ newMessages: null, success: false, count: 0, error: "Something went wrong" });
        }
    }

    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Something Went Wrong!", error: err, });
    }
}

function generateToken(email, userId) {
    return accessToken = jwt.sign({ email, userId }, process.env.TOKEN_SECRET);
}