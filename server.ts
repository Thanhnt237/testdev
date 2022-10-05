import express from 'express'
import bodyParser from "body-parser";
import process from "process";
import morgan from 'morgan'
import compression from "compression";
import cors from 'cors'

require('dotenv').config();
const app = express();

// Compress all HTTP responses
app.use(compression());
app.use(cors());

process.on('SIGINT', function onSigint() {
    console.log('SIGINT signal received: closing HTTP server')
    shutdown();
});

process.on('SIGTERM', function onSigterm() {
    console.log('SIGTERM signal received: closing HTTP server')
    shutdown();
});

function shutdown() {
    // clean up your resources and exit
    process.exit();
}

app.use(morgan('dev'));

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true,parameterLimit: 50000 }));
app.use(function(error: any, req: any, res:any, next: any) {
    console.log(error);
    res.sendStatus(400);
});


app.all('/api/resources/*', [require('./routes/routesGuard')]);

app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(req: any, res: any, next: any) {
    req.status = 404;
    next();
});

// Start the server
app.set('port', process.env.SERVER_PORT);
const server = app.listen(app.get('port'), function() {
    console.log(`Express server listening on port ${process.env.SERVER_PORT}`);
});
