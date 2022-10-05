"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const process_1 = __importDefault(require("process"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const app = (0, express_1.default)();
// Compress all HTTP responses
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
process_1.default.on('SIGINT', function onSigint() {
    console.log('SIGINT signal received: closing HTTP server');
    shutdown();
});
process_1.default.on('SIGTERM', function onSigterm() {
    console.log('SIGTERM signal received: closing HTTP server');
    shutdown();
});
function shutdown() {
    // clean up your resources and exit
    process_1.default.exit();
}
app.use((0, morgan_1.default)('dev'));
// app.use(bodyParser.json());
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(function (error, req, res, next) {
    console.log(error);
    res.sendStatus(400);
});
app.all('/api/resources/*', [require('./routes/routesGuard')]);
app.use('/', require('./routes'));
// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
    req.status = 404;
    next();
});
// Start the server
app.set('port', process_1.default.env.SERVER_PORT);
const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${process_1.default.env.SERVER_PORT}`);
});
