const { DataTypes } = require("sequelize");
const db = require('../db');

const Matches = db.define("matches", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    matchTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matchFormat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matchScore: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matchWinner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    playerID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    playerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coachID: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});

module.exports = Matches;