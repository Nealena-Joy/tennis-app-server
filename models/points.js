const { DataTypes } = require("sequelize");
const db = require('../db');

const Points = db.define("points", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    setScore: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameScore: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serveResult: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pointResult: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    coachComment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coachID: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});

module.exports = Points;