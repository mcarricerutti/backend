import {Router} from 'express';
import { cartModel } from '../models/Cart.js';
const cartRouter = Router();


cartRouter.post('/', async (req, res) => {
    try {
        const cart = await cartModel.create([{products:[]}])
        res.send(cart)
    } catch (error) {
        res.send(error)
    }
})

cartRouter.get('/:cid', async (req, res) => {
    const cid= req.params.cid
    try {
        const cart=await cartModel.findById(cid);
        res.send(cart);
    } catch (error) {
        res.send(error);
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid= req.params.cid;
    const pid= req.params.pid;
    const { quantity } = req.body
    const addProduct = await cartModel.insertMany([{cid, products: [{id_prod: pid, quantity: quantity}]}])
    res.send(addProduct)
})

export default cartRouter;