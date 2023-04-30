import { Router } from "express";
import { products } from "../app.js";
import { managerProd } from "../app.js";

const router = Router()
router.get('/',async(req,res)=>{
    const {limit} = req.query
    if(limit){
        let productLimit = products.slice(0, limit)
        res.json(productLimit)   
    }else{
        res.json(products)
    }
    console.log(products)
})

router.get('/:idProduct',async(req,res)=>{
    const {idProduct} = req.params
    const prod = products.find(p => p.id === Number(idProduct))
    res.json(prod)
})

router.post("/",async (req,res) => {
    let {title, description,code, precio,status,stock,category,thumbnail} = req.body;
    const respuestaProductos = await managerProd.addProduct(title, description,code, precio,status,stock,category, thumbnail);

    if(respuestaProductos === 401){
        res.status(400).json("Debe ingresar todos los campos requeridos")
    }
        else if(respuestaProductos === 402) {
            res.status(400).json("El codigo no puede ser igual a uno existente")
        }
        else{
            res.status(200).send({mensaje: "producto agregado con exito"})
            
        }
})

router.put('/:idProduct',async(req,res)=>{
    const {idProduct} = req.params
    const prodNew = req.body
    const prodUpdate = await managerProd.updateProduct(Number(idProduct), prodNew)
    res.json(prodUpdate)
})

router.delete('/:idProduct',async(req,res)=>{
    const {idProduct} = req.params
    const prodDelete = await managerProd.deleteProductById(Number(idProduct))
    res.json(prodDelete)
})

export default router