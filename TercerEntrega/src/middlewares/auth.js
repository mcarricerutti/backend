import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enumError.js";
const autorization = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            CustomError.createError({ 
                name: "Unauthenticated", 
                cause: "User not logged",
                message: "Debes iniciar session para realizar esta acción", 
                code: EErrors.AUTENTICATION_ERROR
            });

        } else {
            if (req.session.user.role == role) {
                next();
            } else {
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