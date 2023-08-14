import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enumError.js";

const autorization = (role1, role2) => {
    return (req, res, next) => {
        //console.log("authorization",req.session.user);
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
            if (req.session.user.role == role1 || req.session.user.role == role2) {
                next();
            } else {
                req.logger.error("Usuario no autorizado");
                CustomError.createError({ 
                    name: "Unauthorized", 
                    cause: "User role not allowed",
                    message: "No tienes permisos para realizar esta acción", 
                    code: EErrors.AUTENTICATION_ERROR
                });
            }
        }
    }
}
export default autorization;