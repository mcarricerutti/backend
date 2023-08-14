import EErrors from "../services/errors/enumError.js";
export default (error, req, res, next) => {
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "Error", error:error.name, message: error.message, cause: error.cause });
            break;
        case EErrors.INVALID_TYPE_ERROR:
            res.status(401).send({ status: "Error", error:error.name, message: error.message, cause: error.cause });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ status: "Error", error:error.name, message: error.message, cause: error.cause });
            break;
        case EErrors.AUTENTICATION_ERROR:
            res.status(401).send({ status: "Error", error:error.name, message: error.message, cause: error.cause });
            break;
        case EErrors.AUTORIZATION_ERROR:
            res.status(403).send({ status: "Error", error:error.name, message: error.message, cause: error.cause });
            break;
        default:
            res.status(500).send({ status: "Error", error: "Error indeterminado" });
            break;
    }
}


