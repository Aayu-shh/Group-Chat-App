const User = require('../models/user');
const bcrypt = require('bcrypt');
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