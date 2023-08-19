
import jwt from 'jsonwebtoken'
import { getAllProds, getAllProducts} from "../services/products.service.js"

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
    try{
        const user = req.user
        const cid = `${user.cart}`
        
        const products = await getAllProds()
    
        if(products){
            products.forEach(prod => prod.cid = cid)
        }
    
        return res.render('products', {
            title: 'Productos',
            first_name: user.first_name,
            last_name: user.last_name,
            products: products,
            role: user.role
        })
    }catch(error){
        console.log(error)
    }
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

// Resetear contraseña
export const resetPass = (req,res) => {
    res.render('resetPass', {title: 'Reset Password'})
}

// mail enviado
export const resetPassMailSent = (req,res) => {
    res.render('resetPassMail',{title: 'Reset Password', success: true})
}
// hubo error
export const resetPassError = (req,res) => {
    res.render('resetPassMail',{title: 'Reset Password'})
}

// Nueva contraseña
export const newPass = (req,res) => {
    // - chequea que el jwt sea valido (que no haya expirado)
    const token = req.params.token
    let success = true
    jwt.verify(token, 'password', (err,data) => {
        // - si expiró renderiza el error y un boton que lo mande a la de resetpass (seteando el success en false)
        if(err) {
            req.logger.error({message:'Invalid token'})
            success = false
            return
        } else {
            // guardo el token en una cookie que expire igual que el token (no se si es necesario que expiren igual)
            const tokenExpires = new Date(data.exp * 1000)  // paso a fecha la expiracion del token
            const dif = tokenExpires - Date.now();  // Calculo la diferencia en tiempo
            const cookieExp = new Date(Date.now() + dif)    // Establece la expiración de la cookie
            res.cookie('reset', token, { expires: cookieExp, httpOnly: true });  // Creo la cookie con la expiracion deseada
        }
    })
    
    // - si es valido le renderiza un campo para introducir nueva contra  y otro para repetirla
    return res.render('newPass',{title: 'Reset Password', success: success})
}