import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enumError.js"

export const auth = (req,res,next) => {
    if(!req.user) {
        return res.redirect('/')
    }
    next(); 
}

export const authUser = (req,res,next) => {
    try {
        if(!req.user) { 
            return res.redirect('/')
        }
        if (req.user.role !== "user") { 
            CustomError.createError({
                name: "Unathorized",
                cause: "Not allowed",
                message:"You don't have the authorization to perfom this action",
                code: EErrors.AUTHORIZATION_ERROR
            })
        }
        next();
    } catch (error) {
        next(error)
    }
}

export const authAdmin = (req,res,next) => {
    try {
        if(!req.user) { 
            return res.redirect('/')
        }
        if (req.user.role !== "admin") { 
            CustomError.createError({
                name: "Unathorized",
                cause: "Not allowed",
                message:"You don't have the authorization to perfom this action",
                code: EErrors.AUTHORIZATION_ERROR
            })
        }

        next();
    } catch (error) {
        next(error)
    }
}