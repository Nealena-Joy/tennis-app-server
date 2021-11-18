const router = require('express').Router();
const { models } = require('../models');
const { validateAdminSession, validatePlayerSession } = require('../middleware');

//!  Test Matches Route
router.get('/test', (req, res) =>{
    res.send( 'This is a test route' );
});

//!  Create New Match
router.post('/creatematch', validateAdminSession, async (req, res) => {
    const {matchTitle, matchFormat, matchScore, playerID} = req.body.match;

    try {
        await models.MatchesModel.create({
            matchTitle,
            matchFormat,
            matchScore,
            playerID,
            coachID: req.user.id
        })
        .then(
            match => {
                res.status(201).json({
                    Message: 'Match created',
                    Match_Title: match.matchTitle,
                    Created_By_CoachID: match.coachID,
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create match: ${err}`
        });
    };
});

//!  Delete Match By ID
router.delete("/delete/:id", validateAdminSession, async (req, res) => {
    try {
        const deleteMatch = await models.MatchesModel.destroy({
          where: { id: req.params.id, coachID: req.user.id },
        });
        res.status(200).json({ message: "Match successfully deleted", matchTitle: deleteMatch.id});
    } catch (err) {
        res.status(500).json({ message: `Failed to delete Match: ${err}` });
    }
});

//!  Update Match By ID
router.put("/update/:id", validateAdminSession, async (req, res) => {
    const {matchTitle, matchFormat, matchScore, playerID} = req.body.match;
    const matchID = req.params.id;
    const updatedMatch = {
        matchTitle: matchTitle,
        matchFormat: matchFormat,
        matchScore: matchScore,
        playerID: playerID
    }

    try {
        await models.MatchesModel.update(updatedMatch, { where: { id: matchID }})
        .then(
            result => {
                res.status(201).json({
                    Message: 'Match updated',
                    updatedMatch
                });
        });
    } catch (err) {
      res.status(500).json({ Message: `Failed to update Match info: ${err}` });
    }
});

//!  Get all matches & points of all players (to use in drop down list of matches)
router.get('/all-matches', validateAdminSession, async (req, res) => {

    try {
        const matches = await models.MatchesModel.findAll({
            include: [
                {
                    model: models.PointsModel
                }
            ]
        });
        res.status(200).json({
            Message: "Success!", 
            All_Matches: matches
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

//!  Get all matches & points of current player
router.get('/my-matches', validatePlayerSession, async (req, res) => {
    const {id, firstName} = req.user;

    try {
        const myMatches = await models.MatchesModel.findAll({
            where: {playerID: id},
            include: [
                {
                    model: models.PointsModel
                }
            ]
        });
        res.status(200).json({
            Message: "Success!", 
            Player_Name: firstName, 
            All_My_Matches: myMatches});
    } catch (err) {
        res.status(500).json({ Error: err });
    }
})

module.exports = router;