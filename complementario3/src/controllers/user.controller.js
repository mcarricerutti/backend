import userService from "../services/user.service.js";
import sendMail from "../utils/nodemailer.js"

export const getUsers = async (req, res) => {
    try {
        const users = await userService.findAll();
        res.status(200).json({status:'success', payload: users});
    } catch (error) {
        req.logger.error("Error en getUsers");
        res.status(500).json({status:'error', payload: error});
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.findById(id);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        req.logger.error("Error en getUserById");
        res.status(500).json({status:'error', payload: error});
    }
}

export const getMockUsers = async (req, res) => {
    try {
        const users = await userService.mockUsers(100);
        res.status(200).json({status:'success', payload: users});
    } catch (error) {
        req.logger.error("Error en getMockUsers");
        res.status(500).json({status:'error', payload: error});
    }
}

export const resetPasswordNewPass = async (req, res) => {
    res.render('resetpasswordnewpass', {id: req.params.id})
}

export const resetPassword = async (req, res) => {
    try {
        //get id from params
        const id = req.params.id;
        const user = await userService.findById(id);
        if (!user) {
            return res.status(400).send({ status: "error", message: "Email no registrado" });
        }
        if (user.passwordModifiableUntil < Date.now()) {
            req.logger.error({ status: "error", message: "El link ha caducado" });
            return res.render('resetpassword', { status: "error", message: "El link ha caducado" });
        }
        const newUser = await userService.resetPassword(user.email,req.body.password);//cambiamos la contraseña
        await setPasswordNotModifiable(newUser);//ponemos la contraseña como no modificable
        if (newUser instanceof Error) {
            return res.render('resetpasswordnewpass', { id:user._id, message: newUser});
        }
        const sentEmail = await sendMail(newUser.email, "Contraseña actualizada", "Su contraseña de flykite ha sido actualizada correctamente", "<h1>Contraseña Actualizada</h1>", null);
        if(!sentEmail){
            req.logger.error("Error enviando email de actualizacion de contraseña");
            return res.status(500).send({ status: "error", message: "Error enviando email de actualizacion de contraseña" });
        }
        req.logger.info("Email de actualizacion de contraseña enviado");
        return res.status(200).send({ status: "success", message: "Contraseña actualizada" });
    } catch (error) {
        req.logger.error(error);
        return res.status(500).send({ status: "error", message: "Error reseteando password" });
    }
}

export const setPasswordModifiable = async (req, res) => {
    try {
        const id = req.params.id;
        //Se define una duracion fecha actual + 1 hora
        const date = Date.now() + 3600000;
        const user = await userService.setPasswordModifiable(id, date);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        req.logger.error("Error en setPasswordModifiable");
        res.status(500).json({status:'error', payload: error});
    }
}

const setPasswordNotModifiable = async (user) => {
    try {
        const newUser = await userService.setPasswordNotModifiable(user);
        return newUser;
    } catch (error) {
        return error
    }
}

export const changePremiumRole = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.changePremiumRole(id);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        req.logger.error("Error en changePremiumRole");
        res.status(500).json({status:'error', payload: error});
    }
}