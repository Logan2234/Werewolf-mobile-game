

// Patches
const { inject, errorHandler } = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Require Dependencies

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');


const logger = require('./util/logger');

// Load .env Enviroment Variables to process.env

require('mandatoryenv').load([
    'DB',
    'PORT',
    'SECRET',
    'TOKENSECRET'
]);

const { PORT } = process.env;


// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Swagger Documentation
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

// Assign Routes

app.use('/', require('./routes/router.js'));


// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
    res
        .status(404)
        .json({ status: false, message: 'Endpoint Not Found' });
})

// Open Server on selected Port
app.listen(
    PORT,
    () => console.info('Server listening on port ', PORT)
);

const ws = require("ws");
const wss = new ws.Server({ port: 8080 });

wss.on('connection', function (socket) {
    socket.on('message', (msg) => {
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN)
                client.send(msg.toString())
        });
    });
});
