import { Router } from 'express';
import { addProductOnCart, createCart, deleteCart, deleteProductOnCart, getCartById, getCarts, updateProductOnCart, updateProductQuantityOnCart, purchaseCart} from '../controllers/cart.controller.js';
import authz from '../middlewares/autorization.js';
import auth from '../middlewares/authentication.js';


const cartRouter = Router(); 

cartRouter.get('/createcart', createCart);

cartRouter.get('/', getCarts);

cartRouter.get('/:cid', getCartById);

cartRouter.put("/:cid",auth(), updateProductOnCart);

cartRouter.delete("/:cid",auth(),authz('admin'), deleteCart);

cartRouter.get('/:cid/purchase',auth(), purchaseCart);

cartRouter.post("/:cid/product/:pid",auth(),authz('user','premium'), addProductOnCart);

cartRouter.delete("/:cid/product/:pid",auth(), deleteProductOnCart);

cartRouter.put("/:cid/product/:pid",auth(), updateProductQuantityOnCart)

//Otras Rutas
cartRouter.put("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});
cartRouter.get("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});
cartRouter.post("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});
cartRouter.delete("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});

export default cartRouter;