import { createLogger, format, transports } from "winston";

module.exports = createLogger({
    level: "info",
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.printf(info => `[${info.level}] ${getDate()},${info.message}`)
    ),
    transports: [
        new transports.File({
            maxFiles: 5,
            maxsize: 5120000,
            filename: `${__dirname}/../logs/log-api.log`
        }),
        new transports.Console()
    ]
});

function getDate(){
    let date = new Date();
    let formatdateUTC = date.toUTCString();
    return formatdateUTC.substring(5,25)
}
