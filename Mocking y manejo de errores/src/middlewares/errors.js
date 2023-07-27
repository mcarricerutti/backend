import EErrors from "../services/errors/enumError.js";

export default(error,req,res,next) => {
    console.log(error.cause)
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.INVALID_TYPES_ERROR:
            res.status(401).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.AUTHENTICATION_ERROR:
            res.status(401).send({ status: "Error", error:error.name, message: error.message });
            break;
        case EErrors.AUTHORIZATION_ERROR:
            res.status(403).send({ status: "Error", error:error.name, message: error.message });
            break;
        default:
            res.status(500).send({ status: "Error", error: "Unhandled error" });
            break;
    }
}