import EErrors from "../services/errors/enumError.js";
export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.INVALID_TYPE_ERROR:
            res.status(401).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.AUTENTICATION_ERROR:
            res.status(401).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.AUTORIZATION_ERROR:
            res.status(403).send({ status: "Error", error:error.name, message: error.message });
            break;
        default:
            res.status(500).send({ status: "Error", error: "Error indeterminado" });
            break;
    }
}