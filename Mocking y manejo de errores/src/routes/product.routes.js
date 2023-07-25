import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import {authAdmin} from '../middlewares/auth.js'

const productRouter = new Router()

productRouter.get('/', getProducts)
productRouter.get('/:pid', getProductById)
productRouter.post('/', authAdmin, addProduct)
productRouter.put('/:pid', authAdmin, updateProduct)
productRouter.delete('/:pid', authAdmin, deleteProduct)

export default productRouter