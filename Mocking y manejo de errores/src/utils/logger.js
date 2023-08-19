import winston from "winston";
import { options } from "./commander.js";

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
    req.logger = options.mode === "dev" ? devLogger : prodLogger;
    next();
}

export const logger = (options.mode === 'dev') ? devLogger : prodLogger // Para usarlo en los lugares que no tienen el req