import * as winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const Logger: winston.Logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    level: process.env.LOGLEVEL || 'info',
    defaultMeta: { service: 'ts-latest-api' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    Logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export default Logger;