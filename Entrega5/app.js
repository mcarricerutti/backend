import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

import cartsRouter from './routes/carts.router.js'
import productRouter from './routes/products.router.js'
import viewsHandlebars from './routes/views.router.js'
import {ProductManager} from './ProductManager.js'

import { __dirname } from './utils.js'
export let managerProd = new ProductManager()
export const products = await managerProd.getProducts()
export const carrito = await managerProd.getProductsCart()

const app = express()

//archivo estatico
app.use(express.static(__dirname+'/public'))

// Configuramos el handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname +'/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({extended:true}))




app.use('/api/carts',cartsRouter)
app.use('/api/products',productRouter)
app.use('/',viewsHandlebars)

const server = app.listen(4000,(req,res)=>{
    console.log('Escuchando al puerto 4000')
})

export const socketServer = new Server(server)

socketServer.on("connection",(socket)=>{
    console.log(`Usuario conectado ${socket.id}`)

    socket.on("disconnect",()=> {
        console.log("Usuario desconectado")
    });

    socket.on("prod",async (productosAdd)=>{
        let prodForm = await managerProd.listToShow();
        prodForm.push(productosAdd)
        socketServer.emit('productoFromForm',prodForm)

        
    });


    socket.on("prodDelete",async (prod) =>{
        const {id} = prod;
        let prodServer = await managerProd.listToShow(id);
        socketServer.emit("prodDeletelist", prodServer)
    })


})