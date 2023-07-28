import { findAllCarts, createNewCart, getProducts, addProduct, deleteProduct, updateArrayProds, updateProductQuantity, resetCartProds } from '../services/cart.service.js';
import {createTicket} from '../services/ticket.service.js'
import { __dirname } from '../utils/path.js';

// Devuelve todos los carritos
export const getCarts = async (req,res,next) => {
    try {
        const carts = await findAllCarts()
        res.send(carts)
    } catch (error) {
        res.logguer.error("Error en getCarts");
        res.status(500).send("ERROR: " + error);
    }
}

// Crea un carrito nuevo
export const createCart = async (req,res,next) => {
    try {
        await createNewCart()
        res.send('Carrito creado exitosamente.')
    } catch (error) {
        res.logguer.error("Error en createCart")
        res.status(500).send("ERROR: "+ error);
    }
}

// Devuelve los productos de un carrito segun id
export const getCartProducts = async (req,res,next) => {
    try {
        const {cid} = req.params
        const products = await getProducts(cid)

        //Devuelve error si no lo encuentra
        if (!products.length) {
            return res.status(404).json({message: `Cart ${cid} not founded or is empty`, payload: []})
        }

        return res.status(200).json({message: `Cart ${cid} founded`, payload: products})

    } catch (error) {
        res.logguer.error("Error en getCartProducts");
        res.status(500).send("ERROR: " + error);
    }
}

// Agrega un producto a un carrito. Por body se le pasa quantity
export const addCartProduct = async (req,res) => {
    try {
        const {pid, cid} = req.params
        const quantity = req.body.quantity

        if(quantity>0){
            
            const carrito = await addProduct(cid,pid,quantity)
            
            if(!carrito) {
                return res.status(404).json({error: 'Cart not found'})
            }
            
            return res.status(200).json({message: 'Product added to cart', cart: carrito})
        }
        else {
            return res.status(400).json({error: 'Invalid quantity'})
        }
        
    } catch (error) {
        res.logguer.error("Error en addCartProduct");
        res.status(500).send("Error: " + error);
    }
}

// Elimina un producto del carrito seleccionado
export const deleteCartProduct = async (req,res,next) => {
    try {
        let { cid, pid } = req.params
        const carrito = await deleteProduct(cid, pid)
        return res.status(200).json({message: 'Product deleted from cart', cart: carrito})

    } catch (error) {
        res.logguer.error("Error en deleteCartProduct");
        res.status(500).send("Error: Cart ID no existe\n\n" + error);
    }
}

// Actualiza los productos de un carrito con un array de ids de productos dado (se lo paso por req.body)
export const updateArrayProducts = async (req,res,next) => {
    try {
        const { cid } = req.params
        const { array } = req.body // el arreglo viene en el body como {"array":["646bc84ff89d0072c10920b4","646bc784f89d0072c10920ac"]}

        const carrito = await updateArrayProds(cid, array)

        return res.status(200).json({message: 'Cart updated', cart: carrito})

    } catch (error) {
        res.logguer.error("Error en updateArrayProducts");
        res.status(500).send("Error: Cart ID o formato del arreglo products incorrectos \n\n" + error);
    }
}

// Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
export const updateCartProductQuantity = async (req,res,next) => {
    try {
        let { cid, pid } = req.params
        let { quantity } = req.body

        const carrito = await updateProductQuantity(cid,pid,quantity)

        return res.status(200).json({message: 'Quantity updated', cart: carrito})

    } catch (error) {
        res.logguer.error("Error en updateCartProductQuantity");
        res.status(500).send("Error: Cart ID o Product ID o quantity Incorrectos \n\n" + error);
    }
}

// Elimina todos los productos del carrito
export const resetCart = async (req,res,next) => {
    try {
        const { cid } = req.params
        const carrito = await resetCartProds(cid)

        return res.status(200).json({message: 'Cart reseted', cart: carrito})

    } catch (error) {
        res.logguer.error("Error en resetCart");
        res.status(500).send("Error: Cart ID no existe\n\n" + error);
    }
}


// Genera un ticket de compra con los items del carrito que estan en stock
export const purchase = async (req,res,next) => {
    try {
        const { cid } = req.params
        const { email } = req.user
        const newTicket = await createTicket(cid, email)
        // console.log('newTicket',newTicket)
        if(newTicket.ticket){
            // mandar mail
            const URL = `http://localhost:4000/api/mail/ticket`
            fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify(newTicket),
                    headers: {"Content-type": "application/json; charset=UTF-8"}
                })
            .then(response => response.json())
            .then(res => console.log(res))
            .catch(err => console.log(err))
        }
        return res.status(200).json({'order':newTicket})

    } catch (error) {
        res.logguer.error("Error en purchaseCart");
        res.status(500).send(error);
    }
}