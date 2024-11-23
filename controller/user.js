const User = require('../models/user');
const Message = require('../models/chat');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    console.log("User found:" + userInDb)
    if (userInDb) {
        const isPassCorrect = await bcrypt.compare(pass, userInDb.password);
        //If user in DB > Check Pass
        if (isPassCorrect) {
            res.status(200).send({ success: true, message: "User found!", token: `${generateToken(email, id)}` })
        }
        else {
            res.status(401).send({ success: false, message: "Wrong Password!" });
        }
    }
    else {
        //If User not in DB
        res.status(404).send({ success: false, message: "User Not found" })
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

function generateToken(email, userId) {
    return accessToken = jwt.sign({ email, userId }, process.env.TOKEN_SECRET);
}