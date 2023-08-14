import userService from "../services/users.service.js"
import sendMail from "../utils/nodemailer.js"

// Login '/'
export const login = (req,res,next) => {
    // Si ya esta logueado lo manda a la vista de productos
    if(req.user) {
       return res.redirect('/products')
    }  
    // Si no esta logueado muestra el formulario de login
    return res.render('login', { 
        title: 'Login'
    })
}
 
// Registro
export const signUp = (req,res,next) => {
    // Si ya esta logueado lo manda a la vista de productos
    if(req.user) {
        return res.redirect('/products')
    }  
    // Si no esta logueado muestra el formulario de signup
    return res.render('signup', {
        title: 'Sign up'
    })
}

//Agregra Producto
export const aggProd = (req,res,next) => {
    if(req.user.rol === "admin"){
        return res.render('realTimeProducts')
    }else{
        return res.status(403).json("Forbidden");
    }
}

// Perfil
export const profile = (req,res,next) => {
    const user = req.user
        return res.render('profile', {
        title: 'Perfil',
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
        age: user.age,
        role: user.role
    })
}

// Vista de productos
export const products = async (req,res,next) => {
    const user = req.user
    const cid = `${user.cart}`
    let products
    await fetch('http://localhost:4000/api/products')
    .then(res => res.json())
    .then(data => {
        products = data.docs
    })
    .catch(err => console.error(err))

    if(products){products.forEach(prod => prod.cid = cid)}

    return res.render('products', {
        title: 'Productos',
        first_name: user.first_name,
        last_name: user.last_name,
        products: products,
        role: user.role
    })
}

export const errorLogin = async (req,res,next) => {
    res.render('errorLogin', {
        title: 'Error Login',})
}

export const errorSignUp = async (req, res, next) => {
    res.render("errorSignup", {
        title: "Error Signup"
    })
}


// Vista de cart
export const cart = async (req,res,next) => {
    const user = req.user
    const cid = `${user.cart}`
    console.log(`Esto es ${cid}`)
    let products = await fetch(`http://localhost:4000/api/carts/${user.cart}`)
        .then(res => res.json())
        .then(data => data.payload)
        .catch(err => console.error(err))

    if(products){products.forEach(prod => prod.cid = cid)}
    return res.render('cart', {
        title: 'Cart',
        products: products,
        cid: cid
    })
}

//Cambiar contraseña
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
        const sentEmail = await sendMail(newUser.email, "Contraseña actualizada", "Su contraseña de TECLAM ha sido actualizada correctamente", "<h1>Contraseña Actualizada</h1>", null);
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

const setPasswordModifiable = async (req, res) => {
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

export default setPasswordModifiable

const setPasswordNotModifiable = async (user) => {
    try {
        const newUser = await userService.setPasswordNotModifiable(user);
        return newUser;
    } catch (error) {
        return error
    }
}