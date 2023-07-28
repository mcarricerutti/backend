import winston from "winston";
import { options } from "./commander.js";

//Primera parte Logger
// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({level: "http"}),
//         new winston.transports.File({filename: './error.log', level: 'warn'}),
//     ]
// })

// export const addLogguer = (req, res, next) => {
//     req.logger = logger;
//     req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
//     next();
// }

const levelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "cyan"
    }
}


const devLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug", //Nivel de loggueo, muestra info y niveles superiores
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',//Nivel de loggueo, muestra error y niveles superiores
            format: winston.format.simple()

        }),
    ]
})

const prodLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info", //Nivel de loggueo, muestra info y niveles superiores
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',//Nivel de loggueo, muestra error y niveles superiores
            format: winston.format.simple()

        }),
    ]
})

export const addLogguer = (req, res, next) => {
    //Usamos logger dependiendo del modo de ejecucion
    req.logger = options.mode === "development" ? devLogger : prodLogger;
    next();
}