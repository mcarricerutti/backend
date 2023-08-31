import { ProductManager, Product } from "../persistencia/DAOs/fileDao/ProductManager.js";
import productService from "../services/product.service.js";
const port = process.env.PORT;
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enumError.js";
import { generateProductErrorInfo } from "../services/errors/infoError.js";

export const seedProducts = async (req, res) => {
  try {
    const productManager = new ProductManager("../persistencia/DAOs/fileDao/productsSeed.txt");
    const seedProducts = await productManager.getProducts();
    //console.log(seedProducts);
    await productService.insertMany(seedProducts);
    res.status(200).send(await productService.findAll());
  } catch (error) {
    res.status(500).send("ERROR: " + error);
  }
};

export const getProducts = async (req, res) => {
  try {
    //Si no existe una session redireccionamos al login
    if (!req.session.user) {
      res.redirect("/");
    } else {
      //const products = await productModel.find().lean(); //obtenemos los productos
      const { limit, page, sort, query } = req.query; //obtenemos el query limit page sort y query
      const objQuery = query != undefined ? JSON.parse(query) : undefined; //query debe escribisrse en formato JSON en URL {"category":"kites","status":"true"}
      //console.log(objQuery);
      const queryFail =
        query != undefined
          ? Object.keys(objQuery).some((key) => {
            return key != "category" && key != "status";
          })
          : undefined;
      //console.log(queryFail);

      let paginatedProducts = await productService.paginate(
        //Primer parametro: filtro
        objQuery ?? {},

        //Segundo parametro: opciones
        {
          limit: limit ?? 10,
          page: page ?? 1,
          sort: { price: sort },
          lean: true,
        } //Lean es para formato de objeto
      );
      const limitString = limit != undefined ? `limit=${limit}&` : "";
      const sortString = sort != undefined ? `sort=${sort}&` : "";
      const queryString = query != undefined ? `query=${query}&` : "";

      paginatedProducts.prevLink = paginatedProducts.hasPrevPage
        ? `http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.prevPage}`
        : "";
      paginatedProducts.nextLink = paginatedProducts.hasNextPage
        ? `http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.nextPage}`
        : "";
      paginatedProducts = {
        status: !(page <= 0 || page > paginatedProducts.totalPages)
          ? "success"
          : "error",
        ...paginatedProducts,
      };

      if (queryFail) {
        res.status(400)
          .send(`ERROR: en query se debe especificar category o status o ambos en formato JSON 
                        </br>ejemplos: </br>query={\"category\":\"kites\"} 
                        </br>query={\"status\":\"true\"}
                        </br>query={\"category\":\"kites\",\"status\":\"true\"}`);
      } else {
        //res.send(paginatedProducts); //enviamos los productos
        res.status(200).render("products", {
          pagProducts: paginatedProducts,
          user: req.session.user,
        });
      }
    }
  } catch (error) {
    req.logger.error("Error en getProducts");
    res.status(500).send("ERROR: " + error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productService.findById(pid); //obtenemos los productos
    res.status(200).send(product); //enviamos los productos
  } catch (error) {
    //res.send("ERROR: " + error.message);
    req.logger.error("Error en getProductById");
    res.status(500).send(error.message);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const {title,description,thumbnails,price,code,stock,status,category,} = req.body; //Consulto los datos enviados por postman
    if (!title ||!description ||!code ||!price ||!status ||!category ||!stock) {
      //Si no hay datos
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(req.body),
        message: "Error trying to create a new product",
        code: EErrors.INVALID_TYPE_ERROR,
      }); //Lanzo un error
      //res.status(401).send("El producto no contiene todos los datos requeridos");
    } 
    const obj={...req.body, owner: req.session.user.email};
    res.status(200).send(await productService.create(obj));
  } catch (error) {
    req.logger.error("Error en addProduct");
    next(error);
    //https://stackoverflow.com/questions/29700005/express-4-middleware-error-handler-not-being-called
    //For handling errors that are thrown during asynchronous code execution in Express (versions < 5.x), you need to manually catch and invoke the in-built error handler (or your custom one) using the next() function
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    const updatedObject = req.body; //Consulto los datos enviados por postman

    if(req.session.user.role == "premium"){
      const product = await productService.findById(pid);
      if(product.owner != req.session.user.email){
        CustomError.createError({
          name: "Product update error",
          cause: "User not allowed to update this product",
          message: "Error trying to update a product",
          code: EErrors.INVALID_TYPE_ERROR,
        }); //Lanzo un error
      }
    }
    res.status(200).send(await productService.findByIdAndUpdate(pid, updatedObject)); //return implicito
  } catch (error) {
    req.logger.error("Error en updateProduct");
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    const product = await productService.findById(pid);
    if(req.session.user.role == "premium" & product.owner != req.session.user.email){
      CustomError.createError({
        name: "Product delete error",
        cause: "User not allowed to delete products from other users",
        message: "Error trying to delete a product",
        code: EErrors.INVALID_TYPE_ERROR,
      }); //Lanzo un error
    }
    res.status(200).send(await productService.delete(pid));
  } catch (error) {
    req.logger.error("Error en deleteProduct");
    next(error);
  }
};

export const realTimeProducts = async (req, res) => {
  const io = req.io;

  //Conexion a socket.io
  io.on("connection", async (socket) => {

    //Onload
    socket.emit("server:onloadProducts", await productService.findAll());
    //NewProduct
    socket.on("client:newproduct", (data) => {
      newProduct(data);
    });
    //DeleteProduct
    socket.on("client:deleteProduct", (id) => {
      deleteProduct(id);
    });

    const newProduct = async (data) => {
      const newProduct = new Product(
        data.title,
        data.description,
        data.thumbnails,
        data.price,
        data.code,
        data.stock,
        data.status,
        data.category
      );
      await productService.create({...newProduct, owner: req.session.user.email});
      const updatedProducts = await productService.findAll();
      socket.emit("server:updatedProducts", updatedProducts);
    };

    const deleteProduct = async (id) => {
      await productService.delete(id);
      const updatedProducts = await productService.findAll();
      socket.emit("server:updatedProducts", updatedProducts);
    };
  });

  //Render
  try {
    const products = await productService.findAll();
    res.status(200).render("realtimeproducts", { products: products });
  } catch (error) {
    req.logger.error("Error en realTimeProducts");
    res.status(500).send("ERROR: " + error);
  }
};

export const getMockProducts = async (req, res) => {
  try {
    const products = await productService.mockProducts(100);
    res.status(200).json({ status: "success", payload: products });
  } catch (error) {
    req.logger.error("Error en getMockProducts");
    res.status(500).json({ status: "error", payload: error })
  }
}
