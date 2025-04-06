const Sequelize = require('sequelize');
const sequelize = require("../util/db");

const Message = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Message;