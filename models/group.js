const Sequelize = require('sequelize');
const sequelize = require("../util/db");

module.exports = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        // allowNull: false
    }
})
