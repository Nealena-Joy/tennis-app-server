const router = require('express').Router();
const { models } = require('../models');
const { validateAdminSession } = require('../middleware');
 
//! Test Points Route
router.get('/test', (req, res) =>{
    res.send( 'This is a test route' );
});

//!  Create New Point
router.post('/point', validateAdminSession, async (req, res) => {
    const {setScore, gameScore, serveResult, pointResult, coachComment, matchId, matchTitle} = req.body.point;
    
    try {
        await models.PointsModel.create({
            setScore,
            gameScore,
            serveResult,
            pointResult,
            coachComment, 
            matchId,
            coachID: req.user.id,
            matchTitle
        })
        .then(
            point => {
                res.status(201).json({
                    Message: 'Point created',
                    SetGamePoint: `${point.setScore}, ${point.gameScore}`,
                    PointDetails: point,
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            Error: `Failed to create point: ${err}`
        });
    };
});

//!  Delete Point By ID
router.delete('/delete/:pointID', validateAdminSession, async (req, res) => {
    try {
        const deletePoint= await models.PointsModel.destroy({
          where: { pointID: req.params.pointID, coachID: req.user.id },
        });
        res.status(200).json({ 
            Message: "Point successfully deleted", 
            Point_ID: deletePoint.pointID, 
        });
    } catch (err) {
        res.status(500).json({ Message: `Failed to delete Point: ${err}` });
    }
});

//!  Update Point By ID
router.put("/update/:pointID", validateAdminSession, async (req, res) => {
    const {setScore, gameScore, serveResult, pointResult, coachComment} = req.body.point;
    const pointID = req.params.pointID;
    const updatedPoint = {
        setScore: setScore,
        gameScore: gameScore,
        serveResult: serveResult,
        pointResult: pointResult,
        coachComment: coachComment,
    }
    try {
        await models.PointsModel.update( updatedPoint, {where: { pointID: pointID }})
        .then(
            result => {
                res.status(201).json({
                    Message: 'Point updated',
                    updatedPoint
                });
        });
    } catch (err) {
      res.status(500).json({ Message: `Failed to update Point info: ${err}` });
    }
});

//!  Get all points
router.get('/allpoints', async (req, res) => {
    try {
        const allPoints = await models.PointsModel.findAll();
        res.status(200).json(allPoints);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;