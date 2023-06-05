import { Router } from "express";
import { productModel } from "../models/Products.js";

const productRouter = Router(); //Router para manejo de rutas

productRouter.get("/", async (req, res) => {
  try {
    const products = await productModel.find(); //obtenemos los productos
    const { limit } = req.query; //obtenemos el query limit
    if (limit) {
      products.splice(limit);
    } //si existe limit, lo aplicamos
    //res.send(products); //enviamos los productos
    res.render("home", { products: products });
  } catch (error) {
    res.send("ERROR: " + error);
  }
});

productRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productModel.find(); //obtenemos los productos
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    res.send("ERROR: " + error);
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productModel.findById(pid); //obtenemos los productos
    res.send(product); //enviamos los productos
  } catch (error) {
    res.send("ERROR: " + error);
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const {title,description,thumbnails,price,code,stock,status,category,} = req.body; //Consulto los datos enviados por postman
    if (!title ||!description ||!code ||!price ||!status ||!category ||!stock) {
      //Si no hay datos
      res.send("El producto no contiene todos los datos requeridos");
    } else {
      const newProduct = new Product(title,description,thumbnails,price,code,stock,status,category);
      res.send(await productModel.create(newProduct));
    }
  } catch (error) {
    res.send("ERROR: " + error);
  }

});

productRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    const {title,description,thumbnails,price,code,stock,status,category} = req.body; //Consulto los datos enviados por postman
    const updatedObject = {title: title,description: description,thumbnails: thumbnails,price: price,code: code,stock: stock,status: status,category: category};
    res.send(await productModel.findByIdAndUpdate(pid, updatedObject)); //return implicito
  } catch (error) {
    res.send("ERROR: " + error);
  }

});

productRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    res.send(await productModel.findByIdAndDelete(pid));
  } catch (error) {
    res.send("ERROR: " + error);
  }
});

export default productRouter;
