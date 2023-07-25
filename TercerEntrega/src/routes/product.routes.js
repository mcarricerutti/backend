import { Router } from "express";
import { getMockProducts, seedProducts, getProducts, getProductById, addProduct, updateProduct, deleteProduct, realTimeProducts } from "../controllers/product.controller.js";
import autorization from "../middlewares/auth.js";

const productRouter = Router(); //Router para manejo de rutas

productRouter.get("/seedproducts", seedProducts);

productRouter.get("/", getProducts);

productRouter.get("/mockingproducts", getMockProducts);

productRouter.get("/realtimeproducts", realTimeProducts);

productRouter.get("/:pid", getProductById);

productRouter.post("/", autorization('admin'), addProduct);

productRouter.put("/:pid", autorization('admin'), updateProduct);

productRouter.delete("/:pid", autorization('admin'), deleteProduct);

export default productRouter;