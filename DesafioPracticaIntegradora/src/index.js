import {Server} from 'socket.io';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { __dirname } from './path.js';
//import multer from 'multer';
import { engine } from 'express-handlebars';
import * as path from 'path';

import { ProductManager, Product } from './ProductManager.js';

//models
import {productModel} from './models/Products.js';
import {cartModel} from './models/Cart.js';
import {messageModel} from './models/Messages.js';
import { log } from 'console';



//Configuraciones de Express
export const app = express();
const port = process.env.PORT;


// //Configuracion de Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'src/public/img')
//     },
//     filename: (req, file, cb)=>{
//         cb(null, file.originalname)
//     }
// })

//Configuracion de Handlebars
app.engine('handlebars', engine());//Voy a trabajar con handlebars
app.set('view engine', 'handlebars');//Mis vistas son de tipo handlebars
app.set('views', path.resolve(__dirname, "./views"));//src/views

//Middleware
app.use(express.json());//Permite que el servidor entienda los datos enviados en formato json
app.use(express.urlencoded({ extended: true }));//Permite poder usar Query Strings
//const upload = multer({storage: storage})//metodo de multer para subir archivos




mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(error => console.log(error));



//Escuchar Servidor
const server=app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

//ServerIO (WebSockets)
const io= new Server(server);
const newProduct=null;

io.on('connection', async(socket)=>{//cuando se establece la conexion envio un mensaje
    console.log('Cliente conectado');
  
    //Mongo
    const onLoadProducts= await productModel.find(); 
    socket.emit('server:onloadProducts', onLoadProducts);

    //NewProduct
    socket.on('client:newproduct', async (data) => {
        const newProduct = new Product(data.title, data.description, data.thumbnails, data.price, data.code, data.stock, data.status, data.category)

        //Mongo
        await productModel.create(newProduct);
        const updatedProducts= await productModel.find(); 
        socket.emit('server:updatedProducts', updatedProducts);
      })

    //DeleteProduct
    socket.on('client:deleteProduct', async (id) => {
        
        //Mongo
        await productModel.deleteOne({_id: id});
        const updatedProducts= await productModel.find(); 
        socket.emit('server:deleteProduct', updatedProducts);
    }) 

    //Chat
    socket.on('client:messageSent', async (data)=>{
      await messageModel.create(data);
      const messages= await messageModel.find();
      io.emit('server:messageStored', messages)//envio todos los mensajes a todos los clientes
    });
    socket.on('client:onLoadMessages', async ()=>{
        const messages= await messageModel.find();
        io.emit('server:onLoadMessages', messages)//envio todos los mensajes a todos los clientes
    });
}) 


//Routes
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', express.static(__dirname +'/public'))
app.use('/chat', express.static(__dirname +'/public'))

app.get('/chat', (req, res) => {
  res.render('chat')
})

