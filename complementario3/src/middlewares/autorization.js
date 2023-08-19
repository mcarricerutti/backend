import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enumError.js";

const authz = (role1, role2) => {
    return (req, res, next) => {

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
export default authz;