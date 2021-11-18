const jwt = require('jsonwebtoken');
const { models } = require('../models');

const validateAdminSession = async (req, res, next) => {
    if (req.method == 'OPTIONS') {
        next();
    } else if (
        req.headers.authorization && 
        req.headers.authorization.includes('Bearer')
    ) {
        const { authorization } = req.headers;
        console.log("Authorization:", authorization);

        const payload = authorization ? jwt.verify(
            authorization.includes('Bearer') ? authorization.split(' ')[1] : authorization,
            process.env.JWT_SECRET
        ) : undefined;

        console.log("Payload:", payload);

        if (payload) {
            console.log(payload);
            let foundUser = await models.UsersModel.findOne({ where: { id: payload.id, userRole: 'Coach' }});

            if (foundUser) {
                console.log("Request:", req);
                req.user = foundUser;
                next();
            } else {
                res.status(400).send({ Message: 'Not Authorized'});
            }
        } else {
            res.status(401).send({Message: 'Invalid Token' });
        }
    } else {
        res.status(403).send({ Message: 'Forbidden'});
    };
};

module.exports = validateAdminSession;