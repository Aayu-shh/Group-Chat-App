require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./util/db');
const User = require('./models/user');

const userRoutes = require('./routes/user');
const server = express();



server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors({ origin: '*' }));
server.use('/user',userRoutes);

server.use((req,res)=>{
    return res.json({ "Message": "You are in DEFAULT 'USE' path", "SUCCESS": true });
})

db.sync().then(()=>{
    server.listen(process.env.HTTP_PORT, () => console.log(`Listening to PORT : ${process.env.HTTP_PORT}`));
})
.catch(err => console.log(err));
