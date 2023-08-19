import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import {customJWTPolicy} from '../middlewares/auth.js'

const productRouter = new Router()

productRouter.get('/',customJWTPolicy(["USER","PREMIUM","ADMIN"]), getProducts)
productRouter.get('/:pid',customJWTPolicy(["USER","PREMIUM","ADMIN"]), getProductById)
productRouter.post('/', customJWTPolicy(["PREMIUM","ADMIN"]), addProduct)
productRouter.put('/:pid', customJWTPolicy(["PREMIUM","ADMIN"]), updateProduct)
productRouter.delete('/:pid', customJWTPolicy(["PREMIUM","ADMIN"]), deleteProduct)

export default productRouter