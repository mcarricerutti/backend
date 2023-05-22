import {Router} from 'express';
// import {CartManager} from '../CartManager.js';
import { cartModel } from '../models/Cart.js';

// const cartManager = new CartManager('./src/carts.txt','./src/products.txt');
const cartRouter = Router(); //Router para manejo de rutas

//FS -------------------------------------------------------------------------------------------

// cartRouter.get('/:cid', async (req, res) => {
//     const cid= req.params.cid
//     const cart=await cartManager.getCartById(cid);//obtenemos los productos
//     res.send(cart.products??cart);//enviamos los productos
// });

// cartRouter.post("/:cid/product/:pid", async (req, res) => {
//     const cid= req.params.cid;
//     const pid= req.params.pid;
//     const { quantity } = req.body //Consulto el dato quantity enviado por postman
//     res.send(await cartManager.addProduct(cid,pid,quantity))
// })


//MONGO -------------------------------------------------------------------------------------------
cartRouter.get('/:cid', async (req, res) => {
    const cid= req.params.cid
    try {
        const cart=await cartModel.findById(cid);//obtenemos los productos
        res.send(cart);
    } catch (error) {
        res.send(error);
    }
    //enviamos los productos
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid= req.params.cid;
    const pid= req.params.pid;
    const { quantity } = req.body //Consulto el dato quantity enviado por postman
    try {
        const updatedCart=await cartModel.findByIdAndUpdate(cid,{$push:{products:{id_prod:pid,quantity:quantity}}},{new:true});
        res.send(updatedCart);
    } catch (error) {
        res.send(error)
    }
})

export default cartRouter;