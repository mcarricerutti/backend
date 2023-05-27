import { Router } from "express";
import Productos from "../persistencia/productsManagerMoongos.js";
import productModel from "../persistencia/models/productos.model.js"

const router = Router();
const manager = new Productos();
const port = process.env.PORT;


router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query; //obtenemos el query limit page sort y query
    const objQuery = query!=undefined?JSON.parse(query):undefined;//query debe escribisrse en formato JSON en URL {"category":"kites","status":"true"}
    //console.log(objQuery);
    const queryFail=query!=undefined?Object.keys(objQuery).some(key => {return (key != "category" && key != "status")}):undefined;

    let paginatedProducts = await productModel.paginate(
      //Primer parametro: filtro
      objQuery??{},

      //Segundo parametro: opciones
      {limit: limit??10, page: page??1, sort: {price: sort}, lean: true}//Lean es para formato de objeto
      
    );    
    const limitString=limit!=undefined?`limit=${limit}&`:'';
    const sortString=sort!=undefined?`sort=${sort}&`:'';
    const queryString=query!=undefined?`query=${query}&`:'';

    paginatedProducts.prevLink = paginatedProducts.hasPrevPage?`http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.prevPage}`:'';
    paginatedProducts.nextLink = paginatedProducts.hasNextPage?`http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.nextPage}`:'';
    paginatedProducts={"status":(!(page<=0||page>paginatedProducts.totalPages))?"success": "error",...paginatedProducts};


    if (queryFail){
      res.status(400).send(`ERROR: en query se debe especificar category o status o ambos en formato JSON 
      </br>ejemplos: </br>query={\"category\":\"kites\"} 
      </br>query={\"status\":\"true\"}
      </br>query={\"category\":\"kites\",\"status\":\"true\"}`);
    }
    else{
      res.render("products", { pagProducts: paginatedProducts });
    }
    // {usersDocuments:context.usersDocuments}

  } catch (error) {
    res.send("ERROR: " + error);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productModel.findById(pid); //obtenemos los productos
    res.send(product); //enviamos los productos
  } catch (error) {
    res.send("ERROR: " + error);
  }
});

router.post("/", async (req, res) => {
  const prod = req.body;
  const prodCreate = await manager.createProduct(prod);
  res.json({ message: "producto creado con exito", prodCreate });
});

router.put("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  const prodNew = req.body;
  const newEdit = Object.keys(newValue).toString()
  const value = Object.values(newValue).toString()
  const editProd = await manager.updateProduct(idProduct, newEdit, value, prodNew);
  res.json({message:editProd});
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await manager.deleteProduct(id);
  res.json({ message: "Producto elminado con exito", deleteProduct });
});

router.delete("/", async (req, res) => {
  const deleteFile = await manager.deleteFile();
  res
    .status(200)
    .json({
      mensaje: "todos los productos se eliminaron exitosamente",
      deleteFile,
    });
});



router.get("/realTimeProducts", async (req, res) => {
  const io = req.io;

  //Conexion a socket.io
  io.on('connection', async (socket) => {//cuando se establece la conexion envio un mensaje
    console.log('Cliente conectado a RealTimeProducts');

    //Onload
    socket.emit('server:onloadProducts', await productModel.find());
    //DeleteProduct
    socket.on('client:deleteProduct', (id) => { deleteProduct(id) })


    const deleteProduct = async (id) => {
      await productModel.deleteOne({ _id: id });
      const updatedProducts = await productModel.find();
      socket.emit('server:updatedProducts', updatedProducts);
    };

  });

  //Render
  try {
    const products = await productModel.find(); //obtenemos los productos
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    res.send("ERROR: " + error);
  }

});

export default router;
