import { getAllProducts, getProdById, getProd, addNewProduct, updateProd, deleteProd } from '../services/products.service.js'
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enumError.js";
import { generateProductErrorInfo } from "../services/errors/infoError.js";

// Devuelve todos los productos o la cantidad deseada con limit
export const getProducts = async (req,res,next) => {
    try {
        let { limit, sort, page, category, status } = req.query

        const productos = await getAllProducts(status, category, limit, page, sort)
        productos.status = "success"

        res.status(200).json(productos)
    } catch (error) {
        res.logguer.error("Error en getProducts");
        res.status(500).send("ERROR: " + error);
    }
}

// Devuelve el producto que coincide con el id
export const getProductById = async (req,res,next) => {
    try {
        const { pid } = req.params
        let producto = await getProdById(pid) // si no lo encuentra tira error y va al catch

        if(!producto) {
            req.logger.error('Error trying to get product by id')
            return res.status(400).send(`El producto con id ${req.params.pid} no existe.`)
        }

        return res.status(200).json(producto)

    } catch (error) {
        res.logguer.error("Error en getProductById");
        return res.status(400).json(error);
    }
}

// Agrega un producto
export const addProduct = async (req,res,next) => {
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body
        if (!title || !description || !code || !price || !stock || !category ) {
            CustomError.createError({
                name: "Product creation error",
                cause: generateProductErrorInfo(req.body),
                message: "Error trying to create a new product",
                code: EErrors.INVALID_TYPES_ERROR,
            })
        }

        // Error si ya existe el producto con el code
        let producto = await getProd({code})
        if(producto) { 
            req.logger.error('Error trying to add a new product')
            return res.status(400).json({error: `El producto con el code ${code} ya existe.`})
        }

        // Crea el producto
        const prod = { title, description, code, price, status, stock, category, thumbnails }
        // si el que lo crea es un usuario premium, se le agrega su email al campo owner (por defecto es admin)
        if(req.user.role === "premium"){
            prod.owner = req.user.email
        }
        const newProd = await addNewProduct(prod)
        return res.status(200).json({message: `El producto se ha creado correctamente.`, newProd})

    } catch (error) {
        res.logguer.error("Error en addProduct");
        next(error);
    }
}

// Actualiza un producto
export const updateProduct = async (req,res,next) => {
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body
        let { pid } = req.params

        // si es un usuario premium y no es un producto suyo devuelve error
        const product = await getProdById(pid) 
        if(req.user.role === "premium" && product.owner !== req.user.email){
            return res.status(403).json({error: 'You are not allowed to modify this product'})
        }

        let obj = {title, description, code, price, status, stock, category, thumbnails } 
        await updateProd(pid, obj)

        return res.status(200).json({message:'Producto actualizado correctamente'})

    } catch (error) {
        res.logguer.error("Error en updateProduct");
        res.status(500).send("ERROR: " + error);
    }
}

// Elimina un producto
export const deleteProduct = async (req,res,next) => {
    try {
        let { pid } = req.params
        // si es un usuario premium y no es un producto suyo devuelve error
        const product = await getProdById(pid) 
        if(req.user.role === "premium" && product.owner !== req.user.email){
            return res.status(403).json({error: 'You are not allowed to delete this product'})
        }

        // en caso de que sea su producto o sea el admin
        const prod = await deleteProd(pid)
        if(prod.deletedCount !== 1) {
            req.logger.error('Error trying to delete a product')
            return res.status(400).json({error: `El id ${pid} no es válido.`})
        }
       
        return res.status(200).json({message: 'Producto eliminado correctamente'})
        
    } catch (error) {
        res.logguer.error("Error en deleteProduct");
        res.status(500).send("ERROR: " + error);
    }
}