const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Define the log directory outside the project
const logDirectory = path.resolve(__dirname, '/var/logs/whatsapp-activaton/');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const logFormat = printf(({ level, message, timestamp }) => {
    let logData= `${timestamp} ${level}: ${message}`;
    console.log(logData);
    return logData;

});


const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(logDirectory, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

module.exports = logger;
