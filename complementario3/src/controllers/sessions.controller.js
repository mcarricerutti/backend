
import userService from '../services/user.service.js';
import CurrentUserDTO from '../persistencia/DTOs/currentUserDTO.js';
import sendMail from '../utils/nodemailer.js';
import { setPasswordModifiable } from './user.controller.js';


export const renderRegister = async (req, res) => {
    res.render('register')
}

export const tryRegister = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).render('errors', 'usuario no creado');
        }
        //Registro correcto, enviamos email y el usuario
        const sentEmail=await sendMail(req.user.email, "Registro exitoso", "Bienvenido a Flykite", "<h1>Bienvenido a Flykite</h1>", null);
        req.logger.info("Message sent: %s", sentEmail.messageId);
        res.status(200).send({ status: "success", payload: req.user });
    } catch (error) {
        req.logger.error("Error en tryRegister");
        res.status(401).render('errors', { status: "error", message: "Error de Registro" });
    }
}

export const failregister = async (req, res) => {
    res.status(500).render('errors', { status: "error", message: "Error de Registro" });
}

export const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

export const login = async (req, res) => {
    res.render('login')
}

export const profile = async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
    }
    else {
        res.render('profile', { user: req.session.user })
    }
}

export const tryLogin = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).render('errors', req.message);
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        }
        //redirenccionar usando 303 cambia el metodo a get, en este caso de post a get
        //https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put
        res.status(200).redirect(303,'/api/products');
    } catch (error) {
        req.logger.error("Error en tryLogin");
        res.status(401).render('errors', { status: "error", message: "Login Error" });
    }
}

export const faillogin = async (req, res) => {
    res.status(500).render('errors', { status: "error", message: "Credenciales Incorrectas" });
}

export const currentUser = async (req, res) => {
    try {
        return res.status(200).send(new CurrentUserDTO(req.user));
    } catch (error) {
        req.logger.error("Error en currentUser");
        return res.status(500).send({ status: "error", message: "Error obteniendo current user" });
    }
}

export const resetPasswordView = async (req, res) => {
    res.render('resetpassword')
}

export const resetPasswordEmail = async (req, res) => {
    try {
        const user = await userService.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ status: "error", message: "Email no registrado" });
        }
        //Se define una duracion fecha actual + 1 hora
        const date = Date.now() + 3600000;
        await userService.setPasswordModifiable(user._id, date);//Link de recuperacion de contraseña valido por 1 hora

        const html=`
        <h1>Recuperar Contraseña</h1>
        <p>Para recuperar su contraseña ingrese al siguiente link</p>
        <a href="http://localhost:8080/api/users/${user._id}/resetpasswordnewpass">Recuperar Contraseña</a>
        `;
        const sentEmail=await sendMail(req.body.email, "Recuperar Contraseña", "Recupere su contraseña de flykite", html, null); 

        req.logger.info("Message sent: %s", sentEmail.messageId); 
        return res.status(200).send({ status: "success", message: "Email de recuperacion de contraseña enviado" });      
    } catch (error) {
        req.logger.error("Error en resetPasswordEmail");
        return res.status(500).send({ status: "error", message: "Error enviando email" });
    }
}

