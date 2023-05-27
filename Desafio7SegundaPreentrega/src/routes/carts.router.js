import {Router} from 'express';
import { cartModel } from "../persistencia/models/carts.model.js"
import productModel from "../persistencia/models/productos.model.js"

const cartRouter = Router();

cartRouter.post('/createcart', async (req, res) => {
    try{
        const newCart=await cartModel.create({products:[]});
        res.send(newCart);
    }
    catch(error){
        res.send("ERROR: " + error);
    }
    
});
cartRouter.get('/', async (req, res) => {
    try {
        const cart=await cartModel.find();//obtenemos los carritos
        res.send(cart);
    } catch (error) {
        res.send("ERROR: " + error);
    }
});

cartRouter.get('/:cid', async (req, res) => {
    const cid= req.params.cid
    try {
        const cart=await cartModel.findById(cid).populate('products.id_prod').lean();//obtenemos los productos
        //res.send(cart);
        res.render('carts',{cart:cart});
    } catch (error) {
        res.send("ERROR: " + error);
    }
    //enviamos los productos
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid= req.params.cid;
    const pid= req.params.pid;
    const { quantity } = req.body //Consulto el dato quantity enviado por postman
    try {
        const cart=await cartModel.findById(cid);
        const product= await productModel.findById(pid);

        if(!product){
            res.send("producto no existe"+product);
        }
        //if product is already in cart
        if(cart.products.find(product=>product.id_prod==pid)){
        //find cart and product and update incrementing quantity
            const updatedCart=await cartModel.findOneAndUpdate({_id:cid,"products.id_prod":pid},{$inc:{"products.$.quantity":quantity}},{new:true});
            res.send(updatedCart);
        }
        else{
            //if product is not in cart, add it
            const updatedCart=await cartModel.findOneAndUpdate({_id:cid},{$push:{products:{id_prod:pid,quantity:quantity}}},{new:true});
            res.send(updatedCart);
        }
    } catch (error) {
        res.send( "Error: Cart ID o Product ID no existen\n\n"+error);
    }
})

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cid= req.params.cid;
        const pid= req.params.pid;
        //find cart and delete product
        const updatedCart=await cartModel.findOneAndUpdate({_id:cid},{$pull:{products:{id_prod:pid}}},{new:true});
        res.send(updatedCart);
    } catch (error) {
        res.send("Error: Cart ID o Product ID no existen\n\n" + error);
    }
});

cartRouter.delete("/:cid", async (req, res) => {
    try {
        const cid= req.params.cid;
        //find cart and delete products
        const updatedCart=await cartModel.findOneAndUpdate({_id:cid},{products:[]},{new:true});
        res.send(updatedCart);
    } catch (error) {
        res.send("Error: Cart ID no existe\n\n" + error);
    }
});


cartRouter.put("/:cid", async (req, res) => {
    const cid= req.params.cid;
    const products=req.body.products;
    try {
        //find cart and update products
        const updatedCart=await cartModel.findOneAndUpdate({_id:cid},{products:products},{new:true});
        res.send(updatedCart);
    } catch (error) {
        res.send("Error: Cart ID o formato del arreglo products incorrectos \n\n" + error);
    }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
    const cid= req.params.cid;
    const pid= req.params.pid;
    const { quantity } = req.body //Consulto el dato quantity enviado por postman
    try {
        //find cart and product and update quantity
        const updatedCart=await cartModel.findOneAndUpdate({_id:cid,"products.id_prod":pid},{$set:{"products.$.quantity":quantity}},{new:true});
        res.send(updatedCart);

    } catch (error) {
        res.send( "Error: Cart ID o Product ID o quantity Incorrectos \n\n"+error);
    }
})

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

// import {Router} from "express";
// import CartManager from "../persistencia/carManager.js"; ""

// const router = Router()
// const managerCarrito = new CartManager()


// router.post('/',async(req,res)=>{
//     const createNewCart = await managerCarrito.createCart()
//     res.status(200).json({message:'Carrito creado con exito', createNewCart})
// })

// router.get('/:idCart',async(req,res)=>{
//     const {idCart} = req.params
//     const prodCart = await managerCarrito.getCartsById(id)
//     res.status(200).json({message: `Carrito numero id: ${idCart} identiicado`, prodCart})
// })

// router.post('/:idC/products/:idP',async(req,res)=>{
//     const {idC, idP} = req.params
//     const {quantity} = req.body
//     const prodCart = await managerCarrito.addProductsCart(idC, idP, parseInt(quantity))
//     res.status(200).json(prodCart)
// })

// router.delete(':idC/products/:idP',async(req,res)=>{
//     const {idP} = req.params
//     const deleteProd = await managerCarrito.deleteProd(idP)
//     res.json({message: 'producto eliminado', deleteProd})
// })




// export default router