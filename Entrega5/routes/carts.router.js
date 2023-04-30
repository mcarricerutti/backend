import {Router} from "express";
import {carrito} from '../app.js';
import { managerProd } from "../app.js";

const router = Router()


router.get('/',async(req,res)=>{
    res.json(carrito)
})

router.get('/:idCart',async(req,res)=>{
    const {idCart} = req.params
    const prodCartId = carrito.find(u => u.id === Number(idCart))
    res.json(prodCartId)
})

router.post('/',async(req,res)=>{
    const prodCart = await managerProd.createCart()
    res.status(200).json(prodCart)
})

router.post('/:cid/product/:pid',async(req,res)=>{
    const {cid,pid} = req.params
    const prodCreate = await managerProd.addCart(Number(cid), Number(pid))
    res.json({message:'producto agreado con exito', prodCreate})
})




export default router