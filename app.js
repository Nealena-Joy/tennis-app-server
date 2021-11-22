require('dotenv').config();

//!  Imports
const express = require('express');
const dbConnection = require('./db');
const controllers  = require('./controllers');
const middleware = require('./middleware');

//!  Instantiation
const app = express();

//!  Middleware
app.use(middleware.CORS);
app.use(express.json());

//!  Endpoints
app.use('/auth', controllers.usersController);
// app.use(middleware.validateSession);   //  No need this here, just have it in the individual controller file

app.use('/matches', controllers.matchesController);
app.use('/points', controllers.pointsController);
app.use('/plan', controllers.improvementItemsController);

//!  Database auth & sync
try {
    dbConnection
        .authenticate()
        .then(async () => await dbConnection.sync({force: true})) 
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`[SERVER]: App is listening on ${process.env.PORT}`);
            });
        });
} catch (err) {
    console.log('[SERVER]: Server crashed');
    console.log(err);
}