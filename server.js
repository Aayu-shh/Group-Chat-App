require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./util/db');
const User = require('./models/user');
const Messages = require('./models/message');
const path = require("path");
const userRoutes = require('./routes/user');
const server = express();

server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors({
    origin:
        // "http://127.0.0.1:5500",
        "*"
}))
server.use('/user', userRoutes);

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"))
});

server.use((req, res) => {
    console.log('URL :: ', req.url);
    res.sendFile(path.join(__dirname, "public", `${req.url}`));
});

User.hasMany(Messages);
Messages.belongsTo(User);

db.sync().then(() => {
    server.listen(process.env.HTTP_PORT, () => console.log(`Listening to PORT : ${process.env.HTTP_PORT}`));
})
    .catch(err => console.log(err));
