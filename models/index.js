const db = require('../db');

//!  Models
const UsersModel = require('./users');
const MatchesModel = require('./matches');
const PointsModel = require('./points');
const ImprovementItemsModel = require('./improvementItems');
const { DataTypes } = require("sequelize");

//!  Associations
UsersModel.hasMany(MatchesModel, {foreignKey: {name: 'playerID', type: DataTypes.UUID, allowNull: false}});     //  Users belongs to many matches
// MatchesModel.belongsToMany(UsersModel, {through: 'match-user'});
// UsersModel.belongsToMany(MatchesModel, {through: 'matches-user'});

PointsModel.belongsTo(MatchesModel);    // A Point belongs to a specific Match
MatchesModel.hasMany(PointsModel);      // A Match can have many Points


//!  Export
module.exports = {
    dbConnection: db,
    models: {
        UsersModel,
        MatchesModel,
        PointsModel,
        ImprovementItemsModel
    }
};