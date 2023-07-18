import { Router } from 'express';
import { addProductOnCart, createCart, deleteCart, deleteProductOnCart, getCartById, getCarts, updateProductOnCart, updateProductQuantityOnCart, purchaseCart} from '../controllers/cart.controller.js';
import autorization from '../middlewares/auth.js'


const cartRouter = Router();

cartRouter.get('/createcart', createCart);

cartRouter.get('/', getCarts);

cartRouter.get('/:cid', getCartById);

cartRouter.get('/:cid/purchase', purchaseCart);

cartRouter.post("/:cid/product/:pid",autorization('user'), addProductOnCart)

cartRouter.delete("/:cid/product/:pid", deleteProductOnCart);

cartRouter.delete("/:cid", deleteCart);

cartRouter.put("/:cid", updateProductOnCart);

cartRouter.put("/:cid/product/:pid", updateProductQuantityOnCart)

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