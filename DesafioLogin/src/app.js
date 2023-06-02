import { Server } from 'socket.io'
import 'dotenv/config'
import cartsRouter from './routes/carts.router.js'
import productRouter from './routes/products.router.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import mensajes from './routes/message.router.js'
import express from 'express';
import './persistencia/dbConfig.js'
import sessionRouter from "./routes/session.router.js"
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from "cookie-parser";

const app = express()
const port = process.env.PORT;

app.use(cookieParser(process.env.COOKIE_SECRET))//Firmo la cookie
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname+'/public'))

//motores de plantilla
app.engine('handlebars',handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views',__dirname+'/views')

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGODB_ATLAS,
        dbName: 'session-mongo-storage',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized: true
}))

app.use('api/products', express.static(__dirname +'/public'))
app.use('/api/carts',cartsRouter)
app.use('/api/products',productRouter)
app.use('/api/mensaje',mensajes)

//ruta raiz
app.use('/',viewsRouter)
app.use('/sessions', sessionRouter)


const httpServer = app.listen(port,(req,res)=>{
    console.log(`Escuchando al puerto ${port}`)
})

//websocket
export const socketServer = new Server(httpServer,{cors:{origin:'*'}})

const mensaje = []

socketServer.on('connection',socket=>{
    console.log('usuario conectado',socket.id)

    socket.on('disconnect',()=>{
        console.log('Usuario desconectado',socket.id)
    })

    socket.on('newUser', user=>{
        console.log('Usuario: ', user)
        socket.broadcast.emit('broadcast',user)
    })

    socket.on('mensaje',info=>{
        mensaje.push(info)
        socketServer.emit('chat',mensaje)
    })


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