import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enumError.js";

const auth = () => {
    return (req, res, next) => {
        if (!req.session.user) {//Si el usuario no esta logueado
            //return res.status(401).send({ message: "Debes iniciar session para realizar esta acción" });
            req.logger.error("Usuario no logueado");
            CustomError.createError({ 
                name: "Unauthenticated", 
                cause: "User not logged",
                message: "Debes iniciar session para realizar esta acción", 
                code: EErrors.AUTENTICATION_ERROR
            });

        } else {//Si el usuario esta logueado
            next();
        }
    }
}
export default auth;