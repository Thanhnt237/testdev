"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
module.exports = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }), winston_1.format.printf(info => `[${info.level}] ${getDate()},${info.message}`)),
    transports: [
        new winston_1.transports.File({
            maxFiles: 5,
            maxsize: 5120000,
            filename: `${__dirname}/../logs/log-api.log`
        }),
        new winston_1.transports.Console()
    ]
});
function getDate() {
    let date = new Date();
    let formatdateUTC = date.toUTCString();
    return formatdateUTC.substring(5, 25);
}
