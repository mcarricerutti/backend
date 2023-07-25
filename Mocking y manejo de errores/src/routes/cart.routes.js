import { Router } from "express";
import { 
    getCarts, 
    createCart, 
    getCartProducts, 
    addCartProduct, 
    deleteCartProduct, 
    updateArrayProducts, 
    updateCartProductQuantity, 
    resetCart,
    purchase
} from '../controllers/cart.controller.js'
import {authUser} from '../middlewares/auth.js'


const cartRouter = new Router()

cartRouter.get('/', getCarts)
cartRouter.post('/', authUser, createCart)
cartRouter.get('/:cid', getCartProducts)
cartRouter.post('/:cid/products/:pid', authUser, addCartProduct)
cartRouter.delete('/:cid/products/:pid', authUser, deleteCartProduct)
cartRouter.put('/:cid', authUser, updateArrayProducts)
cartRouter.put('/:cid/products/:pid', authUser, updateCartProductQuantity)
cartRouter.delete('/:cid', authUser, resetCart)

cartRouter.get('/:cid/purchase', authUser, purchase)

export default cartRouter