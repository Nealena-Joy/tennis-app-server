const router = require('express').Router();
const { models } = require('../models');
const { validatePlayerSession } = require('../middleware');

//!  Test 
router.get('/test', (req, res) =>{
    res.send( 'This is a test route' );
});

//!  Create improvement item
router.post('/item', validatePlayerSession, async (req, res) => {
    const {title, details, playerID} = req.body.improvementItem;

    try {
        await models.ImprovementItemsModel.create({
            title, 
            details,
            playerID: req.user.id
        })
        .then(
            Item => {
                res.status(201).json({
                    Message: 'Item successfully created',
                    Title: Item
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create Item: ${err}`
        });
    };
});

//!  Update Item By ID
router.put("/update/:itemID", validatePlayerSession, async (req, res) => {
    const {title} = req.body.improvementItem;
    const itemID = req.params.itemID
    const updatedItem = {
        title: title,
        playerID: req.user.id
    }

    try {
        await models.ImprovementItemsModel.update(updatedItem, { where: { itemID: itemID }})
        .then(
            result => {
                res.status(201).json({
                    Message: 'Item updated',
                    updatedItem
                });
        });
    } catch (err) {
      res.status(500).json({ Message: `Failed to update info: ${err}` });
    }
});

//!  Delete Item by ID
router.delete("/delete/:itemID", validatePlayerSession, async (req, res) => {
    try {
        const deleteItem = await models.ImprovementItemsModel.destroy({
          where: { itemID: req.params.itemID, playerID: req.user.id },
        });
        res.status(200).json({ message: "Item successfully deleted"});
    } catch (err) {
        res.status(500).json({ message: `Failed to delete Item: ${err}` });
    }
});

//!  Get all items of current player/user
router.get('/my-items', validatePlayerSession, async (req, res) => {
    const {id, firstName} = req.user;

    try {
        const myPlan = await models.ImprovementItemsModel.findAll({
            where: {playerID: id},
        });
        res.status(200).json({
            Message: "Success!", 
            Player_Name: firstName, 
            All_My_Items: myPlan});
    } catch (err) {
        res.status(500).json({ Error: err });
    }
})

module.exports = router;