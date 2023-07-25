
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