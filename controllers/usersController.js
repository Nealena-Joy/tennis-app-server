const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const { validateAdminSession, validatePlayerSession } = require('../middleware');

//!  Test User Route
router.get('/test', (req, res) =>{
    res.send( 'This is a test route' );
});

//!  User Registration
router.post('/register', async (req, res) =>{
    const {firstName, lastName, username, password, userRole} = req.body.user;
    try {
        await models.UsersModel.create({
            firstName,
            lastName,
            username,
            password: bcrypt.hashSync(password, 10),
            userRole
        })
        .then(
            user => {
                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                res.status(201).json({
                    Message: 'User successfully created',
                    Session_Token: `Bearer ${token}`,                    
                    UserDetails: user
                });
            }
        )
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                Message: 'Username already in use'
            });
        } else {
            res.status(500).json({
                Error: `Failed to register user: ${err}`
            });
        };
    };
});

//!  User Login
router.post('/login', async (req, res) => {

    const { username, password } = req.body.user;

    try {
        await models.UsersModel.findOne({
            where: {
                username: username
            }
        })
        .then(
            user => {
                if (user) {
                    bcrypt.compare(password, user.password, (err, matches) => {
                        if (matches) {
                            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
                            
                            res.status(200).json({
                                Message: 'User successfully logged in',
                                Session_Token: `Bearer ${token}`,
                                UserDetails: user
                             
                            });
                        } else {
                            res.status(401).send({
                                Error: 'Incorrect email or password'
                            })
                        }
                    })
                } else {
                    res.status(401).send({
                        Error: 'Incorrect email or password'
                    })
                }
            }
        )
    } catch (err) {
        res.status(500).send({
            Error: 'Server does not support this functionality'
        })
    }
})

//!  Get all user info
router.get('/all-users', validateAdminSession, async (req, res) => {
    try {
        await models.UsersModel.findAll({
            include: [
                {
                    model: models.MatchesModel,
                    include: [
                        {
                            model: models.PointsModel
                        }
                    ]
                }
            ]
        })                   
        .then(
            users => {
                res.status(200).json({
                    users: users
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});

//!  Get all players
router.get('/all-players', validateAdminSession, async (req, res) => {
    try {
        await models.UsersModel.findAll({
            where: {userRole: 'Player'},
            include: [
                {
                    model: models.MatchesModel,
                    include: [
                        {
                            model: models.PointsModel
                        }
                    ]
                }
            ]
        })                     
        .then( players => {
            res.status(200).json({
                PlayerDetails: players
            });
        })
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});

//!  Delete Player - Coach only
router.delete('/player-delete/:id', validateAdminSession, async (req, res) => {
    const {id, firstName, username} = req.body.user;
    const playerID = req.params.id;
    const player = {
        playerID: id,
        username: username
    }

    try {
        await models.UsersModel.destroy({where: {id: playerID}})
        res.status(200).json({
            Message: "Player deleted"
        });
    } catch (err) {
        res.status(500).json({Message: `Failed to delete Player: ${err}`})
    }
});

//!  Delete current user
router.delete('/current-delete/:id', async (req, res) => {
    try {
        await models.UsersModel.destroy({where: {id: req.params.id}})
        res.status(200).json({
            Message: "User successfully deleted"
        });
    } catch (err) {
        res.status(500).json({Message: `Failed to delete yser: ${err}`})
    }
});

//!  Update current user's info
router.put('/:id', async (req, res) => {
    const { firstName, lastName, username, password, id } = req.body.user;
    const userID = req.params.id;
    const updatedUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password:  bcrypt.hashSync(password, 10)
    }
    try {
        await models.UsersModel.update(updatedUser, {where: {id: userID}})
        .then(
            result => {
            res.status(200).json({
                message: "Updated User Info", 
                id: userID,
                updatedUser
            });
        });
    } catch (err) {
        res.status(500).json({message: `Failed to update user info. ${err}`})
    }
});

module.exports = router;