import CurrentUserDTO from '../persistencia/DTOs/currentUserDTO.js';
import sendMail from '../utils/nodemailer.js';


export const renderRegister = async (req, res) => {
    res.render('register')
}

export const tryRegister = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).render('errors', 'usuario no creado');
        }
        //Registro correcto, enviamos email y el usuario
        const sentEmail=await sendMail(req.user.email, "Registro exitoso", "Bienvenido a TECLAM", "<h1>Bienvenido a TECLAM</h1>", null);
        console.log("Message sent: %s", sentEmail.messageId);
        res.status(200).send({ status: "success", payload: req.user });
    } catch (error) {
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
        res.status(200).redirect(303,'/api/products');
    } catch (error) {
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
        return res.status(500).send({ status: "error", message: "Error obteniendo current user" });
    }
}